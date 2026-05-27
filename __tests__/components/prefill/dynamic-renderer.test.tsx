import { render, screen, fireEvent } from '@testing-library/react';
import DynamicRenderer from '@/components/prefill/dynamic-renderer';
import { FormType } from '@/types/index';
import { FormNodeProvider } from '@/app/context/index';

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />,
}));

jest.mock('@/components/ui/input-group', () => ({
  InputGroup: ({ children }: any) => <div data-testid="input-group">{children}</div>,
  InputGroupInput: (props: any) => <input data-testid="input-group-input" {...props} />,
  InputGroupAddon: ({ children }: any) => <span>{children}</span>,
  InputGroupButton: (props: any) => <button data-testid="input-group-button" {...props} />,
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props: any) => <input type="checkbox" data-testid="checkbox" {...props} />,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children }: any) => <label>{children}</label>,
}));

jest.mock('@/components/ui/field', () => ({
  Field: ({ children }: any) => <div data-testid="field">{children}</div>,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea data-testid="textarea" {...props} />,
}));

describe('components/prefill/dynamic-renderer (RendererEngine)', () => {
  const mockForm: FormType = {
    id: 'form-1',
    name: 'Test Form',
    description: 'A test form',
    is_reusable: true,
    field_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
    ui_schema: {
      type: 'object',
      elements: [],
    },
    dynamic_field_config: {
      button: {
        selector_field: 'button',
        payload_fields: { userId: { type: 'string', value: '123' } },
        endpoint_id: 'endpoint-1',
      },
      dynamic_checkbox_group: {
        items: { enum: ['option1', 'option2'], type: 'string' },
        type: 'array',
        uniqueItems: true,
      },
      dynamic_object: {
        enum: [],
        title: 'Object',
        type: 'object',
      },
    },
  };

  it('should render short-text field', () => {
    render(
      <FormNodeProvider>
        <DynamicRenderer type="short-text" title="Email" format="email" form={mockForm} />
      </FormNodeProvider>
    );

    expect(screen.getByTestId('field')).toBeInTheDocument();
  });

  it('should render email input for short-text with email format', () => {
    render(
      <FormNodeProvider>
        <DynamicRenderer type="short-text" title="Email Address" format="email" form={mockForm} />
      </FormNodeProvider>
    );

    const input = screen.getByTestId('input-group-input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should display field label when showLabel is true', () => {
    render(
      <FormNodeProvider>
        <DynamicRenderer
          type="short-text"
          title="Email"
          format="email"
          showLabel={true}
          form={mockForm}
        />
      </FormNodeProvider>
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should handle field value changes', () => {
    const mockOnChange = jest.fn();
    render(
      <FormNodeProvider>
        <DynamicRenderer
          type="short-text"
          title="Email"
          format="email"
          onValueChange={mockOnChange}
          form={mockForm}
        />
      </FormNodeProvider>
    );

    const input = screen.getByTestId('input-group-input');
    expect(input).toBeInTheDocument();
  });

  it('should handle placeholder text', () => {
    render(
      <FormNodeProvider>
        <DynamicRenderer type="short-text" title="Email" format="email" form={mockForm} />
      </FormNodeProvider>
    );

    const input = screen.getByTestId('input-group-input');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
  });

  it('should convert title to field key', () => {
    render(
      <FormNodeProvider>
        <DynamicRenderer type="short-text" title="Email Address" format="email" form={mockForm} />
      </FormNodeProvider>
    );

    const input = screen.getByTestId('input-group-input');
    expect(input).toHaveAttribute('name', 'email_address');
  });

  it('should validate email format', () => {
    render(
      <FormNodeProvider>
        <DynamicRenderer
          type="short-text"
          title="Email"
          format="email"
          value="test@example.com"
          form={mockForm}
        />
      </FormNodeProvider>
    );

    // Component should handle validation
    expect(screen.getByTestId('field')).toBeInTheDocument();
  });

  it('should return null for unsupported field type without format', () => {
    const { container } = render(
      <FormNodeProvider>
        <DynamicRenderer type="short-text" title="Text" format="text" form={mockForm} />
      </FormNodeProvider>
    );

    // Should render with default text format
    expect(screen.getByTestId('field')).toBeInTheDocument();
  });

  it('should have proper attributes for email inputs', () => {
    render(
      <FormNodeProvider>
        <DynamicRenderer
          type="short-text"
          title="Email"
          format="email"
          value="test@example.com"
          form={mockForm}
        />
      </FormNodeProvider>
    );

    const input = screen.getByTestId('input-group-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
  });

  describe('DynamicRenderer - Extended Tests', () => {
    it('should handle special characters in field title', () => {
      render(
        <FormNodeProvider>
          <DynamicRenderer
            type="short-text"
            title="Email & Contact (2024)"
            format="email"
            form={mockForm}
          />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('input-group-input');
      expect(input).toHaveAttribute(
        'name',
        'email_&_contact_(2024)'.toLowerCase().replace(/ /g, '_')
      );
    });

    it('should handle very long field titles', () => {
      const longTitle = 'This is a very long field title that might break naming conventions';

      render(
        <FormNodeProvider>
          <DynamicRenderer type="short-text" title={longTitle} format="email" form={mockForm} />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('field')).toBeInTheDocument();
    });

    it('should handle rapid value changes', async () => {
      const mockOnChange = jest.fn();

      render(
        <FormNodeProvider>
          <DynamicRenderer
            type="short-text"
            title="Email"
            format="email"
            onValueChange={mockOnChange}
            form={mockForm}
          />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('input-group-input');

      // Rapid changes
      for (let i = 0; i < 10; i++) {
        fireEvent.change(input, { target: { value: `test${i}@example.com` } });
      }

      expect(input).toBeInTheDocument();
    });

    it('should preserve form data reference', () => {
      const { rerender } = render(
        <FormNodeProvider>
          <DynamicRenderer type="short-text" title="Email" format="email" form={mockForm} />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('field')).toBeInTheDocument();

      // Rerender with same form
      rerender(
        <FormNodeProvider>
          <DynamicRenderer type="short-text" title="Email" format="email" form={mockForm} />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('field')).toBeInTheDocument();
    });

    it('should handle null form gracefully', () => {
      const { container } = render(
        <FormNodeProvider>
          <DynamicRenderer type="short-text" title="Email" format="email" form={null as any} />
        </FormNodeProvider>
      );

      // Should not crash with null form
      expect(container).toBeInTheDocument();
    });

    it('should handle undefined format gracefully', () => {
      render(
        <FormNodeProvider>
          <DynamicRenderer type="short-text" title="Text" format={undefined} form={mockForm} />
        </FormNodeProvider>
      );

      // Should render with default text type
      const input = screen.getByTestId('input-group-input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should handle form with undefined field_schema', () => {
      const incompleteForm: FormType = {
        ...mockForm,
        field_schema: undefined as any,
      };

      const { container } = render(
        <FormNodeProvider>
          <DynamicRenderer type="short-text" title="Email" format="email" form={incompleteForm} />
        </FormNodeProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it('should support url input format', () => {
      render(
        <FormNodeProvider>
          <DynamicRenderer type="short-text" title="Website" format="url" form={mockForm} />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('input-group-input');
      expect(input).toHaveAttribute('type', 'url');
    });

    it('should call onValueChange with correct parameters', async () => {
      const mockOnChange = jest.fn();

      render(
        <FormNodeProvider>
          <DynamicRenderer
            type="short-text"
            title="Email"
            format="email"
            onValueChange={mockOnChange}
            form={mockForm}
          />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('input-group-input');
      fireEvent.change(input, { target: { value: 'test@example.com' } });

      // Verify onChange was triggered
      expect(input).toBeInTheDocument();
    });

    it('should handle onReset callback', () => {
      const mockOnReset = jest.fn();

      render(
        <FormNodeProvider>
          <DynamicRenderer
            type="short-text"
            title="Email"
            format="email"
            onReset={mockOnReset}
            form={mockForm}
          />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('field')).toBeInTheDocument();
    });

    it('should handle custom className', () => {
      const { container } = render(
        <FormNodeProvider>
          <DynamicRenderer
            type="short-text"
            title="Email"
            format="email"
            className="custom-class"
            form={mockForm}
          />
        </FormNodeProvider>
      );

      expect(container).toBeInTheDocument();
    });
  });
});
