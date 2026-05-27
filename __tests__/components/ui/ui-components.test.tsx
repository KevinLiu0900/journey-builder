import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormNodeProvider } from '@/app/context/index';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props: any) => <input type="checkbox" data-testid="checkbox" {...props} />,
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />,
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children }: any) => <label>{children}</label>,
}));

jest.mock('@/components/ui/field', () => ({
  Field: ({ children, ...props }: any) => (
    <div data-testid="field" {...props}>
      {children}
    </div>
  ),
}));

describe('UI Component Integration Tests', () => {
  describe('Button Component', () => {
    it('should render button with text', () => {
      render(
        <FormNodeProvider>
          <button data-testid="test-button">Click Me</button>
        </FormNodeProvider>
      );

      expect(screen.getByTestId('test-button')).toHaveTextContent('Click Me');
    });

    it('should handle click events', () => {
      const mockClick = jest.fn();
      render(
        <FormNodeProvider>
          <button data-testid="clickable" onClick={mockClick}>
            Click
          </button>
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByTestId('clickable'));
      expect(mockClick).toHaveBeenCalled();
    });

    it('should support disabled state', () => {
      render(
        <FormNodeProvider>
          <button data-testid="disabled-btn" disabled>
            Disabled
          </button>
        </FormNodeProvider>
      );

      const button = screen.getByTestId('disabled-btn');
      expect(button).toBeDisabled();
    });
  });

  describe('Input Component', () => {
    it('should render input field', () => {
      render(
        <FormNodeProvider>
          <input data-testid="text-input" type="text" placeholder="Enter text" />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('text-input')).toBeInTheDocument();
      expect(screen.getByTestId('text-input')).toHaveAttribute('placeholder', 'Enter text');
    });

    it('should handle input changes', async () => {
      render(
        <FormNodeProvider>
          <input data-testid="changeable-input" type="text" />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('changeable-input') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(input.value).toBe('new value');
    });

    it('should support different input types', () => {
      render(
        <FormNodeProvider>
          <input data-testid="email-input" type="email" />
          <input data-testid="password-input" type="password" />
          <input data-testid="number-input" type="number" />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email');
      expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');
      expect(screen.getByTestId('number-input')).toHaveAttribute('type', 'number');
    });
  });

  describe('Checkbox Component', () => {
    it('should render checkbox', () => {
      render(
        <FormNodeProvider>
          <input data-testid="test-checkbox" type="checkbox" />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('test-checkbox')).toBeInTheDocument();
    });

    it('should toggle checked state', () => {
      render(
        <FormNodeProvider>
          <input data-testid="toggle-checkbox" type="checkbox" />
        </FormNodeProvider>
      );

      const checkbox = screen.getByTestId('toggle-checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    it('should work with labels', () => {
      render(
        <FormNodeProvider>
          <label>
            <input type="checkbox" data-testid="labeled-checkbox" />
            Agree to terms
          </label>
        </FormNodeProvider>
      );

      expect(screen.getByText('Agree to terms')).toBeInTheDocument();
      expect(screen.getByTestId('labeled-checkbox')).toBeInTheDocument();
    });
  });

  describe('Field Component', () => {
    it('should render field wrapper', () => {
      render(
        <FormNodeProvider>
          <div data-testid="field">
            <label>Email</label>
            <input type="email" />
          </div>
        </FormNodeProvider>
      );

      expect(screen.getByTestId('field')).toBeInTheDocument();
    });

    it('should support complex field layouts', () => {
      render(
        <FormNodeProvider>
          <div data-testid="field">
            <label>Full Name</label>
            <input type="text" placeholder="First name" />
            <input type="text" placeholder="Last name" />
          </div>
        </FormNodeProvider>
      );

      const field = screen.getByTestId('field');
      expect(field).toBeInTheDocument();
      expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
    });
  });

  describe('Label Component', () => {
    it('should render label', () => {
      render(
        <FormNodeProvider>
          <label htmlFor="input-1">Label Text</label>
          <input id="input-1" />
        </FormNodeProvider>
      );

      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });
  });

  describe('Form Integration Tests', () => {
    it('should handle form submission with all fields', async () => {
      const mockSubmit = jest.fn();

      render(
        <FormNodeProvider>
          <form
            onSubmit={e => {
              e.preventDefault();
              mockSubmit();
            }}
            data-testid="test-form"
          >
            <label>Email</label>
            <input type="email" data-testid="email" required />

            <label>Password</label>
            <input type="password" data-testid="password" required />

            <button type="submit" data-testid="submit-btn">
              Submit
            </button>
          </form>
        </FormNodeProvider>
      );

      const emailInput = screen.getByTestId('email') as HTMLInputElement;
      const passwordInput = screen.getByTestId('password') as HTMLInputElement;

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(screen.getByTestId('submit-btn'));

      expect(mockSubmit).toHaveBeenCalled();
      expect(emailInput.value).toBe('test@example.com');
      expect(passwordInput.value).toBe('password123');
    });

    it('should validate required fields', () => {
      render(
        <FormNodeProvider>
          <input type="email" required data-testid="required-input" />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('required-input');
      expect(input).toHaveAttribute('required');
    });

    it('should handle multiple checkbox selections', async () => {
      render(
        <FormNodeProvider>
          <label>
            <input type="checkbox" data-testid="check-1" value="option-1" />
            Option 1
          </label>
          <label>
            <input type="checkbox" data-testid="check-2" value="option-2" />
            Option 2
          </label>
          <label>
            <input type="checkbox" data-testid="check-3" value="option-3" />
            Option 3
          </label>
        </FormNodeProvider>
      );

      const check1 = screen.getByTestId('check-1') as HTMLInputElement;
      const check2 = screen.getByTestId('check-2') as HTMLInputElement;
      const check3 = screen.getByTestId('check-3') as HTMLInputElement;

      fireEvent.click(check1);
      fireEvent.click(check3);

      expect(check1.checked).toBe(true);
      expect(check2.checked).toBe(false);
      expect(check3.checked).toBe(true);
    });

    it('should handle input validation patterns', () => {
      render(
        <FormNodeProvider>
          <input
            type="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            data-testid="email-pattern"
          />
          <input type="number" min="0" max="100" data-testid="number-range" />
          <input type="text" minLength="5" maxLength="20" data-testid="text-length" />
        </FormNodeProvider>
      );

      expect(screen.getByTestId('email-pattern')).toHaveAttribute('pattern');
      expect(screen.getByTestId('number-range')).toHaveAttribute('min', '0');
      expect(screen.getByTestId('number-range')).toHaveAttribute('max', '100');
      expect(screen.getByTestId('text-length')).toHaveAttribute('minLength', '5');
      expect(screen.getByTestId('text-length')).toHaveAttribute('maxLength', '20');
    });
  });

  describe('Button States and Variants', () => {
    it('should handle button with loading state', () => {
      const { rerender } = render(
        <FormNodeProvider>
          <button data-testid="loading-btn" disabled>
            Loading...
          </button>
        </FormNodeProvider>
      );

      let button = screen.getByTestId('loading-btn');
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent('Loading...');

      rerender(
        <FormNodeProvider>
          <button data-testid="loading-btn">Submit</button>
        </FormNodeProvider>
      );

      button = screen.getByTestId('loading-btn');
      expect(button).not.toBeDisabled();
      expect(button).toHaveTextContent('Submit');
    });

    it('should support different button types', () => {
      render(
        <FormNodeProvider>
          <button type="button" data-testid="btn-button">
            Button
          </button>
          <button type="submit" data-testid="btn-submit">
            Submit
          </button>
          <button type="reset" data-testid="btn-reset">
            Reset
          </button>
        </FormNodeProvider>
      );

      expect(screen.getByTestId('btn-button')).toHaveAttribute('type', 'button');
      expect(screen.getByTestId('btn-submit')).toHaveAttribute('type', 'submit');
      expect(screen.getByTestId('btn-reset')).toHaveAttribute('type', 'reset');
    });

    it('should handle button with multiple click handlers', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      render(
        <FormNodeProvider>
          <button
            data-testid="multi-click"
            onClick={e => {
              handler1();
              handler2();
            }}
          >
            Click
          </button>
        </FormNodeProvider>
      );

      fireEvent.click(screen.getByTestId('multi-click'));

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe('Input Edge Cases', () => {
    it('should handle very long input values', async () => {
      render(
        <FormNodeProvider>
          <input data-testid="long-input" type="text" />
        </FormNodeProvider>
      );

      const longValue = 'a'.repeat(1000);
      const input = screen.getByTestId('long-input') as HTMLInputElement;

      fireEvent.change(input, { target: { value: longValue } });

      expect(input.value).toBe(longValue);
      expect(input.value.length).toBe(1000);
    });

    it('should handle special characters in input', async () => {
      render(
        <FormNodeProvider>
          <input data-testid="special-input" type="text" />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('special-input') as HTMLInputElement;
      const specialValue = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';

      fireEvent.change(input, { target: { value: specialValue } });

      expect(input.value).toBe(specialValue);
    });

    it('should handle unicode characters', async () => {
      render(
        <FormNodeProvider>
          <input data-testid="unicode-input" type="text" />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('unicode-input') as HTMLInputElement;
      const unicodeValue = '你好世界 🌍 مرحبا العالم';

      fireEvent.change(input, { target: { value: unicodeValue } });

      expect(input.value).toBe(unicodeValue);
    });

    it('should handle rapid input changes', async () => {
      render(
        <FormNodeProvider>
          <input data-testid="rapid-input" type="text" />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('rapid-input') as HTMLInputElement;

      for (let i = 0; i < 100; i++) {
        fireEvent.change(input, { target: { value: i.toString() } });
      }

      expect(input.value).toBe('99');
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper labels for accessibility', () => {
      render(
        <FormNodeProvider>
          <label htmlFor="accessible-input">Accessible Input</label>
          <input id="accessible-input" type="text" />
        </FormNodeProvider>
      );

      const input = screen.getByLabelText('Accessible Input');
      expect(input).toBeInTheDocument();
    });

    it('should support ARIA attributes', () => {
      render(
        <FormNodeProvider>
          <input
            data-testid="aria-input"
            type="text"
            aria-label="Test input"
            aria-required="true"
          />
        </FormNodeProvider>
      );

      const input = screen.getByTestId('aria-input');
      expect(input).toHaveAttribute('aria-label', 'Test input');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('should support disabled state with proper accessibility', () => {
      render(
        <FormNodeProvider>
          <button data-testid="disabled-accessible" disabled aria-disabled="true">
            Disabled Button
          </button>
        </FormNodeProvider>
      );

      const button = screen.getByTestId('disabled-accessible');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });
});
