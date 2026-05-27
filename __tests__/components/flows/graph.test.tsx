import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GraphContent from '@/components/flows/graph';

// Mock the useFetch hook
jest.mock('@/hooks/use-fetch', () => ({
  useFetch: jest.fn(),
}));

// Mock the Flow component
jest.mock('@/components/flows/flow', () => {
  return function DummyFlow() {
    return <div data-testid="flow-component">Flow Component</div>;
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <div data-testid="alert-icon">Alert</div>,
  RotateCcw: () => <div data-testid="retry-icon">Retry</div>,
  Loader2: () => <div data-testid="loader-icon">Loader</div>,
}));

import { useFetch } from '@/hooks/use-fetch';

describe('components/flows/graph (GraphContent)', () => {
  const mockGraphData = {
    nodes: [{ id: 1, label: 'Node 1' }],
    edges: [{ source: 1, target: 2 }],
    forms: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('should display loading indicator while fetching', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        retry: jest.fn(),
      });

      render(<GraphContent />);

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText('Loading blueprint...')).toBeInTheDocument();
    });

    it('should show spinner animation during loading', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: null,
        loading: true,
        error: null,
        retry: jest.fn(),
      });

      render(<GraphContent />);

      const loader = screen.getByTestId('loader-icon').closest('div');
      expect(loader).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('should display error message when fetch fails', () => {
      const errorMessage = 'Failed to connect to server';
      (useFetch as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: new Error(errorMessage),
        retry: jest.fn(),
      });

      render(<GraphContent />);

      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByText('Failed to load blueprint')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should show retry button on error', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: new Error('Network error'),
        retry: jest.fn(),
      });

      render(<GraphContent />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).not.toBeDisabled();
    });

    it('should show refresh page button on error', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: new Error('Network error'),
        retry: jest.fn(),
      });

      render(<GraphContent />);

      const refreshButton = screen.getByRole('button', { name: /refresh page/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should call retry function when retry button is clicked', () => {
      const mockRetry = jest.fn();
      (useFetch as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: new Error('Network error'),
        retry: mockRetry,
      });

      render(<GraphContent />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      expect(mockRetry).toHaveBeenCalled();
    });

    it('should show HTTP error details', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: new Error('HTTP 500: Internal Server Error'),
        retry: jest.fn(),
      });

      render(<GraphContent />);

      expect(screen.getByText('HTTP 500: Internal Server Error')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should display empty state when data is null after loading', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: null,
        retry: jest.fn(),
      });

      render(<GraphContent />);

      expect(screen.getByText('No blueprint data')).toBeInTheDocument();
      expect(screen.getByText(/blueprint data is empty/i)).toBeInTheDocument();
    });

    it('should show refresh button in empty state', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: null,
        loading: false,
        error: null,
        retry: jest.fn(),
      });

      render(<GraphContent />);

      const refreshButton = screen.getByRole('button', { name: /refresh page/i });
      expect(refreshButton).toBeInTheDocument();
    });
  });

  describe('success state', () => {
    it('should render Flow component when data is available', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: mockGraphData,
        loading: false,
        error: null,
        retry: jest.fn(),
      });

      render(<GraphContent />);

      expect(screen.getByTestId('flow-component')).toBeInTheDocument();
    });

    it('should not show loading or error states when successful', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: mockGraphData,
        loading: false,
        error: null,
        retry: jest.fn(),
      });

      render(<GraphContent />);

      expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
    });

    it('should apply correct styling to success container', () => {
      (useFetch as jest.Mock).mockReturnValue({
        data: mockGraphData,
        loading: false,
        error: null,
        retry: jest.fn(),
      });

      const { container } = render(<GraphContent />);

      const flowDiv = container.querySelector('.scale-95');
      expect(flowDiv).toBeInTheDocument();
    });
  });
});
