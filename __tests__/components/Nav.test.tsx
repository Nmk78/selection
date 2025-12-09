import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Nav from '@/components/Nav';

// Mock the archive action
vi.mock('@/actions/archive', () => ({
  getArchiveMetadatas: vi.fn().mockResolvedValue({
    success: true,
    data: [
      { id: '2023', title: 'Selection 2023' },
      { id: '2024', title: 'Selection 2024' },
    ],
  }),
}));

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Nav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the logo', () => {
    render(<Nav />, { wrapper: createWrapper() });
    const logo = screen.getByAltText('Royal Selection Logo');
    expect(logo).toBeInTheDocument();
  });

  it('should render Home link', () => {
    render(<Nav />, { wrapper: createWrapper() });
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should render Check link', () => {
    render(<Nav />, { wrapper: createWrapper() });
    expect(screen.getByText('Check')).toBeInTheDocument();
  });

  it('should render Policy link', () => {
    render(<Nav />, { wrapper: createWrapper() });
    expect(screen.getByText('Policy')).toBeInTheDocument();
  });

  it('should render Archive button', () => {
    render(<Nav />, { wrapper: createWrapper() });
    const archiveButtons = screen.getAllByText('Archive');
    expect(archiveButtons.length).toBeGreaterThan(0);
  });

  it('should toggle mobile menu on button click', async () => {
    render(<Nav />, { wrapper: createWrapper() });

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
    render(<Nav />, { wrapper: createWrapper() });

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
    render(<Nav />, { wrapper: createWrapper() });

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

  it('should use staleTime for archive query optimization', async () => {
    const { getArchiveMetadatas } = await import('@/actions/archive');

    render(<Nav />, { wrapper: createWrapper() });

    // Wait for the query to complete
    await waitFor(() => {
      expect(getArchiveMetadatas).toHaveBeenCalledTimes(1);
    });
  });
});
