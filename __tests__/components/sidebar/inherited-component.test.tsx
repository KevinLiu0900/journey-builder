import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InheritedComponent from '@/components/sidebar/inherited-component';
import { FormNodeProvider } from '@/app/context/index';

// Mock the UI components to simplify testing
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

jest.mock('@/components/ui/input-group', () => ({
  InputGroup: ({ children }: any) => <div data-testid="input-group">{children}</div>,
  InputGroupInput: (props: any) => <input data-testid="input-group-input" {...props} />,
  InputGroupAddon: ({ children }: any) => <div>{children}</div>,
  InputGroupButton: (props: any) => <button data-testid="input-group-button" {...props} />,
}));

jest.mock('lucide-react', () => ({
  ChevronRight: () => <span>ChevronRight</span>,
  Search: () => <span>Search</span>,
}));

jest.mock('@/app/context', () => ({
  ...jest.requireActual('@/app/context'),
  useAttachFieldContext: () => ({
    attachedField: null,
  }),
}));

describe('components/sidebar/inherited-component.tsx', () => {
  const mockData = [
    {
      id: 'group-1',
      group: 'Personal Info',
      contents: [
        { id: 'field-1', label: 'Email Address', action: jest.fn() },
        { id: 'field-2', label: 'Phone Number', action: jest.fn() },
      ],
    },
    {
      id: 'group-2',
      group: 'Address Info',
      contents: [
        { id: 'field-3', label: 'Street Address', action: jest.fn() },
        { id: 'field-4', label: 'City', action: jest.fn() },
      ],
    },
  ];

  it('should render the component with all groups', () => {
    render(
      <FormNodeProvider>
        <InheritedComponent data={mockData} />
      </FormNodeProvider>
    );

    expect(screen.getByText('Available data')).toBeInTheDocument();
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Address Info')).toBeInTheDocument();
  });

  it('should render search input field', () => {
    render(
      <FormNodeProvider>
        <InheritedComponent data={mockData} />
      </FormNodeProvider>
    );

    const searchInput = screen.getByTestId('input-group-input');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'search');
    expect(searchInput).toHaveAttribute('placeholder', 'Search...');
  });

  it('should toggle dropdown visibility on click', async () => {
    render(
      <FormNodeProvider>
        <InheritedComponent data={mockData} />
      </FormNodeProvider>
    );

    const groupButton = screen.getByText('Personal Info');
    fireEvent.click(groupButton);

    await waitFor(() => {
      expect(screen.getByText('email_address')).toBeInTheDocument();
    });
  });

  it('should filter data by search term', async () => {
    render(
      <FormNodeProvider>
        <InheritedComponent data={mockData} />
      </FormNodeProvider>
    );

    const searchInput = screen.getByTestId('input-group-input');
    fireEvent.change(searchInput, { target: { value: 'email' } });

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.queryByText('Address Info')).not.toBeInTheDocument();
    });
  });

  it('should filter data case-insensitively', async () => {
    render(
      <FormNodeProvider>
        <InheritedComponent data={mockData} />
      </FormNodeProvider>
    );

    const searchInput = screen.getByTestId('input-group-input');
    fireEvent.change(searchInput, { target: { value: 'EMAIL' } });

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });
  });

  it('should handle empty search results', async () => {
    render(
      <FormNodeProvider>
        <InheritedComponent data={mockData} />
      </FormNodeProvider>
    );

    const searchInput = screen.getByTestId('input-group-input');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.queryByText('Personal Info')).not.toBeInTheDocument();
      expect(screen.queryByText('Address Info')).not.toBeInTheDocument();
    });
  });

  it('should handle clearing search term', async () => {
    render(
      <FormNodeProvider>
        <InheritedComponent data={mockData} />
      </FormNodeProvider>
    );

    const searchInput = screen.getByTestId('input-group-input') as HTMLInputElement;

    // Search for something
    fireEvent.change(searchInput, { target: { value: 'email' } });

    await waitFor(() => {
      expect(searchInput.value).toBe('email');
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.getByText('Address Info')).toBeInTheDocument();
    });
  });

  it('should call action callback when field is clicked', async () => {
    const mockAction = jest.fn();
    const dataWithActions = [
      {
        id: 'group-1',
        group: 'Test Group',
        contents: [{ id: 'field-1', label: 'Test Field', action: mockAction }],
      },
    ];

    render(
      <FormNodeProvider>
        <InheritedComponent data={dataWithActions} />
      </FormNodeProvider>
    );

    // Open dropdown
    const groupButton = screen.getByText('Test Group');
    fireEvent.click(groupButton);

    await waitFor(() => {
      const fieldButton = screen.getByText('test_field');
      fireEvent.click(fieldButton);
      expect(mockAction).toHaveBeenCalled();
    });
  });

  it('should format labels correctly (spaces to underscores, lowercase)', async () => {
    const testData = [
      {
        id: 'group-1',
        group: 'Test',
        contents: [{ id: 'field-1', label: 'Multi Word Field', action: jest.fn() }],
      },
    ];

    render(
      <FormNodeProvider>
        <InheritedComponent data={testData} />
      </FormNodeProvider>
    );

    const groupButton = screen.getByText('Test');
    fireEvent.click(groupButton);

    await waitFor(() => {
      expect(screen.getByText('multi_word_field')).toBeInTheDocument();
    });
  });

  it('should handle data with empty contents', () => {
    const emptyData = [
      {
        id: 'group-1',
        group: 'Empty Group',
        contents: [],
      },
    ];

    render(
      <FormNodeProvider>
        <InheritedComponent data={emptyData} />
      </FormNodeProvider>
    );

    expect(screen.getByText('Empty Group')).toBeInTheDocument();
  });

  it('should handle multiple search results across groups', async () => {
    const multiData = [
      {
        id: 'group-1',
        group: 'Group 1',
        contents: [{ id: 'field-1', label: 'Email Address', action: jest.fn() }],
      },
      {
        id: 'group-2',
        group: 'Group 2',
        contents: [{ id: 'field-2', label: 'Email Contact', action: jest.fn() }],
      },
    ];

    render(
      <FormNodeProvider>
        <InheritedComponent data={multiData} />
      </FormNodeProvider>
    );

    const searchInput = screen.getByTestId('input-group-input');
    fireEvent.change(searchInput, { target: { value: 'email' } });

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });
  });

  it('should handle multiple toggles of same dropdown', async () => {
    render(
      <FormNodeProvider>
        <InheritedComponent data={mockData} />
      </FormNodeProvider>
    );

    const groupButton = screen.getByText('Personal Info');

    // First toggle - open
    fireEvent.click(groupButton);
    await waitFor(() => {
      expect(screen.getByText('email_address')).toBeInTheDocument();
    });

    // Second toggle - close
    fireEvent.click(groupButton);
    await waitFor(() => {
      expect(screen.queryByText('email_address')).not.toBeInTheDocument();
    });

    // Third toggle - open again
    fireEvent.click(groupButton);
    await waitFor(() => {
      expect(screen.getByText('email_address')).toBeInTheDocument();
    });
  });

  it('should handle partial word searches', async () => {
    render(
      <FormNodeProvider>
        <InheritedComponent data={mockData} />
      </FormNodeProvider>
    );

    const searchInput = screen.getByTestId('input-group-input');
    fireEvent.change(searchInput, { target: { value: 'addr' } });

    await waitFor(() => {
      expect(screen.getByText('Address Info')).toBeInTheDocument();
    });
  });

  it('should render with complex data structure', () => {
    const complexData = [
      {
        id: 'group-1',
        group: 'Group With Many Fields',
        contents: Array.from({ length: 10 }, (_, i) => ({
          id: `field-${i}`,
          label: `Field ${i}`,
          action: jest.fn(),
        })),
      },
    ];

    render(
      <FormNodeProvider>
        <InheritedComponent data={complexData} />
      </FormNodeProvider>
    );

    expect(screen.getByText('Group With Many Fields')).toBeInTheDocument();
  });
});
