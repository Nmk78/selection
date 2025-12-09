import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CandidateCard from '@/components/CandidateCard';

// Mock the UI components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-content" className={className}>{children}</div>
  ),
  CardHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-header" className={className}>{children}</div>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="badge" className={className}>{children}</span>
  ),
}));

vi.mock('@/components/ui/aspect-ratio', () => ({
  AspectRatio: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="aspect-ratio">{children}</div>
  ),
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="link">{children}</a>
  ),
}));

describe('CandidateCard', () => {
  const mockCandidate = {
    id: 'candidate-123',
    roomId: 'room-123',
    name: 'John Doe',
    intro: 'I am a passionate student who loves technology and innovation.',
    gender: 'male' as const,
    major: 'Computer Science',
    profileImage: 'https://example.com/john.jpg',
    carouselImages: ['https://example.com/img1.jpg'],
    age: 21,
    height: 180,
    weight: 75,
    hobbies: ['Reading', 'Coding', 'Gaming'],
  };

  it('should render candidate name', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render candidate major', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('should render candidate age', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText('Age: 21')).toBeInTheDocument();
  });

  it('should render candidate height and weight', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText('Height: 180 cm')).toBeInTheDocument();
    expect(screen.getByText('Weight: 75 lb')).toBeInTheDocument();
  });

  it('should render candidate intro', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText(mockCandidate.intro)).toBeInTheDocument();
  });

  it('should render all hobbies', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText('Reading')).toBeInTheDocument();
    expect(screen.getByText('Coding')).toBeInTheDocument();
    expect(screen.getByText('Gaming')).toBeInTheDocument();
  });

  it('should render profile image with correct alt text', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    const image = screen.getByAltText('John Doe');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockCandidate.profileImage);
  });

  it('should link to candidate detail page', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', 'candidate/candidate-123');
  });

  it('should apply male color class for male candidates', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    const name = screen.getByText('John Doe');
    expect(name).toHaveClass('text-Cprimary');
  });

  it('should apply female color class for female candidates', () => {
    const femaleCandidate = { ...mockCandidate, gender: 'female' as const, name: 'Jane Doe' };
    render(<CandidateCard candidate={femaleCandidate} />);
    const name = screen.getByText('Jane Doe');
    expect(name).toHaveClass('text-Caccent');
  });

  it('should render hobbies section title', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    expect(screen.getByText('Hobbies:')).toBeInTheDocument();
  });

  it('should render correct number of hobby badges', () => {
    render(<CandidateCard candidate={mockCandidate} />);
    const badges = screen.getAllByTestId('badge');
    expect(badges).toHaveLength(3);
  });
});
