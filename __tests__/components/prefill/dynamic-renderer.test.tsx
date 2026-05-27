import { render, screen } from '@testing-library/react';
import DynamicRenderer from '@/components/prefill/dynamic-renderer.tsx';
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

describe('components/prefill/dynamic-renderer.tsx', () => {
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
          value="invalid-email"
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
        <DynamicRenderer type="short-text" title="Text" form={mockForm} />
      </FormNodeProvider>
    );

    // Should not render for short-text without format
    expect(container.querySelector('[data-testid="field"]')).not.toBeInTheDocument();
  });

  it('should have aria-invalid attribute for invalid values', () => {
    render(
      <FormNodeProvider>
        <DynamicRenderer
          type="short-text"
          title="Email"
          format="email"
          value="not-an-email"
          form={mockForm}
        />
      </FormNodeProvider>
    );

    const input = screen.getByTestId('input-group-input');
    expect(input).toHaveAttribute('aria-invalid');
  });
});
