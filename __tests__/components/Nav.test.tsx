import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Nav from '@/components/Nav';

// Mock convex/react
vi.mock('convex/react', () => ({
  useQuery: vi.fn((query) => {
    if (query === undefined) return null;
    // Return mock data for archive query
    return {
      data: [
        { _id: '2023', title: 'Selection 2023' },
        { _id: '2024', title: 'Selection 2024' },
      ],
    };
  }),
  Authenticated: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Unauthenticated: ({ children }: { children: React.ReactNode }) => null,
}));

// Mock the api
// vi.mock('@/convex/_generated/api', () => ({
//   api: {
//     archive: {
//       getArchiveMetadatas: 'archive:getArchiveMetadatas',
//     },
//     users: {
//       current: 'users:current',
//     },
//   },
// }));

// Mock UserButton
vi.mock('@/components/auth/UserButton', () => ({
  default: () => <div data-testid="user-button">UserButton</div>,
}));

describe('Nav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the logo', () => {
    render(<Nav />);
    const logo = screen.getByAltText('Royal Selection Logo');
    expect(logo).toBeInTheDocument();
  });

  it('should render Home link', () => {
    render(<Nav />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should render Check link', () => {
    render(<Nav />);
    expect(screen.getByText('Check')).toBeInTheDocument();
  });

  it('should render Policy link', () => {
    render(<Nav />);
    expect(screen.getByText('Policy')).toBeInTheDocument();
  });

  it('should render Archive button', () => {
    render(<Nav />);
    const archiveButtons = screen.getAllByText('Archive');
    expect(archiveButtons.length).toBeGreaterThan(0);
  });

  it('should toggle mobile menu on button click', async () => {
    render(<Nav />);

    // Find the menu toggle button
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();

    // Menu should be closed initially (no mobile nav items visible)
    fireEvent.click(menuButton);

    // After clicking, mobile navigation should be visible
    // The menu toggle should show the close icon
    await waitFor(() => {
      expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    });
  });

  it('should toggle archive dropdown on click', async () => {
    render(<Nav />);

    // Find archive button (there may be multiple - one for desktop, one for mobile)
    const archiveButtons = screen.getAllByText('Archive');

    // Click the first archive button
    fireEvent.click(archiveButtons[0]);

    // Wait for archives to load and dropdown to appear
    await waitFor(() => {
      // The dropdown should show archive items
      expect(screen.getByText('Selection 2023')).toBeInTheDocument();
      expect(screen.getByText('Selection 2024')).toBeInTheDocument();
    });
  });

  it('should have correct navigation links', () => {
    render(<Nav />);

    // Check that navigation links have correct href
    const homeLinks = screen.getAllByRole('link').filter(link =>
      link.getAttribute('href') === '/'
    );
    expect(homeLinks.length).toBeGreaterThan(0);

    const checkLinks = screen.getAllByRole('link').filter(link =>
      link.getAttribute('href') === '/check'
    );
    expect(checkLinks.length).toBeGreaterThan(0);

    const policyLinks = screen.getAllByRole('link').filter(link =>
      link.getAttribute('href') === '/policy'
    );
    expect(policyLinks.length).toBeGreaterThan(0);
  });
});
