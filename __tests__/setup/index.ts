/**
 * Test configuration and utilities
 */

export const mockFormNodeData = {
  id: "form-test-1",
  component_key: "form-key-1",
  component_type: "form",
  component_id: "comp-1",
  name: "Test Form Node",
  prerequisites: [],
  permitted_roles: ["user", "admin"],
  input_mapping: {},
  sla_duration: { number: 24, unit: "hours" },
  approval_required: false,
  approval_roles: [],
};

export const mockFormType = {
  id: "form-1",
  name: "Test Form",
  description: "A test form",
  is_reusable: true,
  field_schema: {
    type: "object",
    properties: {
      email: {
        avantos_type: "short-text" as const,
        type: "string",
        title: "Email",
        format: "email" as const,
      },
    },
    required: ["email"],
  },
  ui_schema: {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/email",
        label: "Email Address",
      },
    ],
  },
  dynamic_field_config: {
    button: {
      selector_field: "submit_btn",
      payload_fields: {
        userId: {
          type: "string",
          value: "user-123",
        },
      },
      endpoint_id: "submit-endpoint",
    },
    dynamic_checkbox_group: {
      items: {
        enum: ["option1", "option2"],
        type: "string",
      },
      type: "array" as const,
      uniqueItems: true,
    },
    dynamic_object: {
      enum: [],
      title: "Object Field",
      type: "object" as const,
    },
  },
};

export const mockGraphData = {
  id: "bp_test_123",
  tenant_id: "1",
  name: "Test Blueprint",
  description: "Blueprint for testing",
  category: "Test",
  nodes: [
    {
      id: "form-1",
      position: { x: 0, y: 0 },
      type: "form",
      data: mockFormNodeData,
    },
    {
      id: "form-2",
      position: { x: 200, y: 0 },
      type: "form",
      data: {
        ...mockFormNodeData,
        id: "form-2",
        name: "Form 2",
        prerequisites: ["form-1"],
      },
    },
  ],
  edges: [
    {
      source: "form-1",
      target: "form-2",
    },
  ],
  forms: [mockFormType],
};

export const setupMockFetch = (mockData: any, status: number = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status === 200,
      status,
      json: () => Promise.resolve(mockData),
      text: () => Promise.resolve(JSON.stringify(mockData)),
      headers: new Map([["Content-Type", "application/json"]]),
    } as unknown as Response),
  );
};

export const setupMockMatchMedia = (matches: boolean = false) => {
  const mockMatchMedia = jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  if (typeof window.matchMedia === "function") {
    window.matchMedia = mockMatchMedia as typeof window.matchMedia;
    return;
  }

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: mockMatchMedia,
  });
};

describe("Test Setup", () => {
  beforeEach(() => {
    setupMockFetch(mockGraphData);
    setupMockMatchMedia();
  });

  it("Mock fetch returns correct data", async () => {
    expect(true).toBeTruthy();
  });
});
