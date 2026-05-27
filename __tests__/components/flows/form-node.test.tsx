import { render, screen, fireEvent } from '@testing-library/react';
import FormNode from '@/components/flows/form-node';
import { FormNodeType } from '@/components/flows/form-node';

// Mock the XYFlow components
jest.mock('@xyflow/react', () => ({
  Handle: () => <div data-testid="handle" />,
  Position: {
    Left: 'left',
    Right: 'right',
    Top: 'top',
    Bottom: 'bottom',
  },
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/dialog', () => ({
  DialogTrigger: ({ children, asChild, ...props }: any) => (
    <div data-testid="dialog-trigger" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  Form: () => <span data-testid="form-icon">FormIcon</span>,
}));

describe('components/flows/form-node.tsx - FormNode Component', () => {
  const mockNodeProps = {
    id: 'node-1',
    data: {
      id: 'form-1',
      component_key: 'key-1',
      component_type: 'form',
      component_id: 'comp-1',
      name: 'Test Form',
      prerequisites: [],
      permitted_roles: [],
      input_mapping: {},
      sla_duration: { number: 0, unit: 'minutes' },
      approval_required: false,
      approval_roles: [],
      onClick: jest.fn(),
    },
    selected: false,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    dragging: false,
  } as any;

  it('should render form node with name', () => {
    render(<FormNode {...mockNodeProps} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should display form label', () => {
    render(<FormNode {...mockNodeProps} />);

    expect(screen.getByText('Form')).toBeInTheDocument();
  });

  it('should render form icon', () => {
    render(<FormNode {...mockNodeProps} />);

    expect(screen.getByTestId('form-icon')).toBeInTheDocument();
  });

  it('should call onClick handler when button is clicked', () => {
    const mockOnClick = jest.fn();
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        onClick: mockOnClick,
      },
    };

    render(<FormNode {...props} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<FormNode {...mockNodeProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('gap-2');
  });

  it('should handle form without prerequisites', () => {
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        prerequisites: [],
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should handle form with prerequisites', () => {
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        prerequisites: ['form-0', 'form-1a'],
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should render dialog trigger wrapper', () => {
    render(<FormNode {...mockNodeProps} />);

    expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
  });

  it('should render all four handles for flow connections', () => {
    render(<FormNode {...mockNodeProps} />);

    const handles = screen.getAllByTestId('handle');
    expect(handles).toHaveLength(4);
  });

  it('should handle undefined onClick gracefully', () => {
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        onClick: undefined,
      },
    };

    render(<FormNode {...props} />);

    const button = screen.getByRole('button');
    // Should not throw when onClick is undefined
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('should handle form with special characters in name', () => {
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        name: 'Form & More (2024)',
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText('Form & More (2024)')).toBeInTheDocument();
  });

  it('should handle very long form names', () => {
    const longName = 'This is a very long form name that might wrap to multiple lines';
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        name: longName,
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it('should render form node with approval required', () => {
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        approval_required: true,
        approval_roles: ['admin', 'manager'],
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should render form node with SLA duration', () => {
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        sla_duration: { number: 24, unit: 'hours' },
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should render form node with input mapping', () => {
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        input_mapping: {
          email: 'form-0.email',
          name: 'form-0.name',
        },
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should handle multiple rapid clicks', () => {
    const mockOnClick = jest.fn();
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        onClick: mockOnClick,
      },
    };

    render(<FormNode {...props} />);

    const button = screen.getByRole('button');

    // Rapid clicks
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it('should handle form with permitted roles', () => {
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        permitted_roles: ['admin', 'manager', 'user'],
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should support different component types', () => {
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        component_type: 'decision_gate',
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should handle numeric IDs', () => {
    const props = {
      ...mockNodeProps,
      id: 'node-12345',
      data: {
        ...mockNodeProps.data,
        id: 'form-12345',
      },
    };

    render(<FormNode {...props} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should preserve node data integrity', () => {
    const originalData = {
      id: 'form-1',
      component_key: 'key-1',
      component_type: 'form',
      component_id: 'comp-1',
      name: 'Test Form',
      prerequisites: [],
      permitted_roles: [],
      input_mapping: {},
      sla_duration: { number: 0, unit: 'minutes' },
      approval_required: false,
      approval_roles: [],
    };

    const props = {
      ...mockNodeProps,
      data: originalData,
    };

    render(<FormNode {...props} />);

    // Node data should be preserved
    expect(screen.getByText('Test Form')).toBeInTheDocument();
  });

  it('should handle click handler with event parameter', () => {
    const mockOnClick = jest.fn();
    const props = {
      ...mockNodeProps,
      data: {
        ...mockNodeProps.data,
        onClick: mockOnClick,
      },
    };

    render(<FormNode {...props} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Verify handler was called
    expect(mockOnClick.mock.calls.length).toBeGreaterThan(0);
  });
});
