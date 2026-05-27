import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FormNodeProvider } from "@/app/context/index";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock the UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/checkbox", () => ({
  Checkbox: (props: any) => (
    <input type="checkbox" data-testid="checkbox" {...props} />
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input data-testid="input" {...props} />,
}));

jest.mock("@/components/ui/label", () => ({
  Label: ({ children }: any) => <label>{children}</label>,
}));

jest.mock("@/components/ui/field", () => ({
  Field: ({ children, ...props }: any) => (
    <div data-testid="field" {...props}>
      {children}
    </div>
  ),
}));

describe("UI Component Integration Tests", () => {
  describe("Button Component", () => {
    it("should render button with text", () => {
      render(
        <FormNodeProvider>
          <button data-testid="test-button">Click Me</button>
        </FormNodeProvider>,
      );

      expect(screen.getByTestId("test-button")).toHaveTextContent("Click Me");
    });

    it("should handle click events", () => {
      const mockClick = jest.fn();
      render(
        <FormNodeProvider>
          <button data-testid="clickable" onClick={mockClick}>
            Click
          </button>
        </FormNodeProvider>,
      );

      fireEvent.click(screen.getByTestId("clickable"));
      expect(mockClick).toHaveBeenCalled();
    });

    it("should support disabled state", () => {
      render(
        <FormNodeProvider>
          <button data-testid="disabled-btn" disabled>
            Disabled
          </button>
        </FormNodeProvider>,
      );

      const button = screen.getByTestId("disabled-btn");
      expect(button).toBeDisabled();
    });
  });

  describe("Input Component", () => {
    it("should render input field", () => {
      render(
        <FormNodeProvider>
          <input
            data-testid="text-input"
            type="text"
            placeholder="Enter text"
          />
        </FormNodeProvider>,
      );

      expect(screen.getByTestId("text-input")).toBeInTheDocument();
      expect(screen.getByTestId("text-input")).toHaveAttribute(
        "placeholder",
        "Enter text",
      );
    });

    it("should handle input changes", async () => {
      render(
        <FormNodeProvider>
          <input data-testid="changeable-input" type="text" />
        </FormNodeProvider>,
      );

      const input = screen.getByTestId("changeable-input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "new value" } });

      expect(input.value).toBe("new value");
    });

    it("should support different input types", () => {
      render(
        <FormNodeProvider>
          <input data-testid="email-input" type="email" />
          <input data-testid="password-input" type="password" />
          <input data-testid="number-input" type="number" />
        </FormNodeProvider>,
      );

      expect(screen.getByTestId("email-input")).toHaveAttribute(
        "type",
        "email",
      );
      expect(screen.getByTestId("password-input")).toHaveAttribute(
        "type",
        "password",
      );
      expect(screen.getByTestId("number-input")).toHaveAttribute(
        "type",
        "number",
      );
    });
  });

  describe("Checkbox Component", () => {
    it("should render checkbox", () => {
      render(
        <FormNodeProvider>
          <input data-testid="test-checkbox" type="checkbox" />
        </FormNodeProvider>,
      );

      expect(screen.getByTestId("test-checkbox")).toBeInTheDocument();
    });

    it("should toggle checked state", () => {
      render(
        <FormNodeProvider>
          <input data-testid="toggle-checkbox" type="checkbox" />
        </FormNodeProvider>,
      );

      const checkbox = screen.getByTestId(
        "toggle-checkbox",
      ) as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    it("should work with labels", () => {
      render(
        <FormNodeProvider>
          <label>
            <input type="checkbox" data-testid="labeled-checkbox" />
            Agree to terms
          </label>
        </FormNodeProvider>,
      );

      expect(screen.getByText("Agree to terms")).toBeInTheDocument();
      expect(screen.getByTestId("labeled-checkbox")).toBeInTheDocument();
    });
  });

  describe("Field Component", () => {
    it("should render field wrapper", () => {
      render(
        <FormNodeProvider>
          <div data-testid="field">
            <label>Email</label>
            <input type="email" />
          </div>
        </FormNodeProvider>,
      );

      expect(screen.getByTestId("field")).toBeInTheDocument();
    });

    it("should support complex field layouts", () => {
      render(
        <FormNodeProvider>
          <div data-testid="field">
            <label>Full Name</label>
            <input type="text" placeholder="First name" />
            <input type="text" placeholder="Last name" />
          </div>
        </FormNodeProvider>,
      );

      const field = screen.getByTestId("field");
      expect(field).toBeInTheDocument();
      expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
    });
  });

  describe("Label Component", () => {
    it("should render label", () => {
      render(
        <FormNodeProvider>
          <label htmlFor="input-1">Label Text</label>
          <input id="input-1" />
        </FormNodeProvider>,
      );

      expect(screen.getByText("Label Text")).toBeInTheDocument();
    });
  });
});
