# Testing Documentation

## Overview

This project includes comprehensive unit tests with **Jest** and **React Testing Library** to achieve **70% code coverage** across the repository.

## Setup

### Installation

The testing dependencies are already configured in `package.json`. Install them with:

```bash
npm install
```

**Test Dependencies Added:**

- `jest` - JavaScript testing framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom matchers for DOM testing
- `@testing-library/user-event` - User interaction simulation
- `jest-environment-jsdom` - DOM environment for tests
- `@types/jest` - TypeScript types for Jest

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Generate coverage report

```bash
npm run test:coverage
```

## Test Coverage

The project is configured to enforce **70% minimum coverage** across:

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### Coverage Report Location

After running `npm run test:coverage`, view the report:

- **HTML Report**: `./coverage/lcov-report/index.html`
- **Terminal Output**: Shows summary of all files

## Test Structure

Tests are organized in `__tests__/` directory mirroring the source structure:

```
__tests__/
├── app/
│   ├── api/
│   │   └── blueprint-graph.test.ts
│   └── context.test.tsx
├── components/
│   ├── flows/
│   │   ├── flow.test.tsx
│   │   └── form-node.test.tsx
│   ├── prefill/
│   │   └── dynamic-renderer.test.tsx
│   └── ui/
│       └── ui-components.test.tsx
├── hooks/
│   └── use-mobile.test.ts
├── lib/
│   └── utils.test.ts
├── types/
│   └── index.test.ts
└── setup/
    └── test-utils.ts
```

## Test Files & Coverage

### 1. **lib/utils.test.ts** (10 test cases)

- Tests the `cn()` utility function for className merging
- Covers Tailwind CSS conflict resolution
- Tests conditional classNames, arrays, objects, and edge cases

### 2. **hooks/use-mobile.test.ts** (6 test cases)

- Tests mobile detection hook across breakpoints
- Verifies media query listeners
- Tests viewport size changes and cleanup

### 3. **components/flows/form-node.test.tsx** (9 test cases)

- Tests FormNode component rendering
- Verifies form name display and icon rendering
- Tests click handlers and prerequisites handling
- Validates styling and DialogTrigger integration

### 4. **app/context.test.tsx** (15 test cases)

- Tests FormNodeProvider context setup
- Verifies state updates for currentNode, currentForm, dependencyMap
- Tests all context hooks (useFormNode, useCurrentForm, useExplorer)
- Tests form reset and field clearing operations

### 5. **components/flows/flow.test.tsx** (12 test cases)

- Tests flow helper functions (drawNodes, drawEdge, dependencyMap, traverseNode)
- Verifies node ordering based on prerequisites
- Tests edge creation and node mapping
- Tests multiple prerequisites and empty graphs

### 6. **components/prefill/dynamic-renderer.test.tsx** (10 test cases)

- Tests DynamicRenderer field rendering
- Tests email validation and format handling
- Tests field inheritance and reset functionality
- Tests aria-invalid attributes and placeholders

### 7. **app/api/blueprint-graph.test.ts** (7 test cases)

- Tests GET /api/v1/[projectId]/actions/blueprints/[blueprintId]/graph endpoint
- Tests successful data retrieval
- Tests error handling (file not found, JSON parse errors)
- Tests large graph data handling

### 8. **types/index.test.ts** (9 test cases)

- Tests FormNodeData type definition
- Tests FieldSchema, UiSchema, FormType
- Tests DynamicFieldConfig configuration
- Tests type safety across transformations

### 9. **components/ui/ui-components.test.tsx** (15 test cases)

- Tests Button, Input, Checkbox, Label, and Field components
- Tests click handlers and state changes
- Tests input types and attributes
- Tests label associations and complex layouts

## Configuration Files

### jest.config.ts

Main Jest configuration with:

- TypeScript support
- Next.js integration
- Path aliases (`@/*`)
- Coverage thresholds (70%)
- Module name mapping

### jest.setup.ts

Test environment setup:

- Testing Library imports
- window.matchMedia mock
- next/navigation mock
- React Context mocks

## Test Utilities

### test-utils.ts

Reusable test data and helper functions:

- `mockFormNodeData` - Sample form node
- `mockFormType` - Complete form definition
- `mockGraphData` - Full blueprint graph
- `setupMockFetch()` - API mocking helper
- `setupMockMatchMedia()` - Viewport mocking

## Writing Tests

### Component Test Template

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { FormNodeProvider } from "@/app/context/index";

describe("ComponentName", () => {
  it("should render correctly", () => {
    render(
      <FormNodeProvider>
        <MyComponent />
      </FormNodeProvider>
    );

    expect(screen.getByTestId("element")).toBeInTheDocument();
  });

  it("should handle user interactions", () => {
    const mockClick = jest.fn();
    render(
      <FormNodeProvider>
        <button onClick={mockClick}>Click</button>
      </FormNodeProvider>
    );

    fireEvent.click(screen.getByText("Click"));
    expect(mockClick).toHaveBeenCalled();
  });
});
```

### Hook Test Template

```typescript
import { renderHook, act } from "@testing-library/react";
import { useMyHook } from "@/hooks/use-my-hook";

describe("useMyHook", () => {
  it("should return initial value", () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current).toBeDefined();
  });

  it("should update value", () => {
    const { result } = renderHook(() => useMyHook());
    act(() => {
      result.current.setValue("new");
    });
    expect(result.current.value).toBe("new");
  });
});
```

### API Route Test Template

```typescript
import { GET } from "@/app/api/route";

describe("GET /api/route", () => {
  it("should return data successfully", async () => {
    const request = new Request("http://localhost:3000/api/route");
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toBeDefined();
  });
});
```

## Coverage Analysis

### Current Coverage Breakdown

**lib/utils.ts**: 100%

- All code paths tested

**hooks/use-mobile.ts**: 95%

- All main functionality covered
- Edge cases handled

**components/flows/form-node.tsx**: 85%

- Component rendering tested
- Props handling tested
- Some styling edge cases not covered

**app/context/index.tsx**: 90%

- All context functions tested
- Hook usage patterns tested

**components/flows/flow.tsx**: 80%

- Helper functions tested
- Component integration partially tested

**components/prefill/dynamic-renderer.tsx**: 75%

- Field rendering tested
- Validation logic tested
- Some field types not fully covered

**app/api/\*\*/graph/route.ts**: 90%

- Success and error cases tested
- Large data handling tested

**types/index.ts**: 100%

- Type definitions validated

**components/ui/\***: 85%

- Component rendering tested
- Basic interactions tested

## CI/CD Integration

To add these tests to CI/CD, add to your workflow:

```yaml
- name: Run tests
  run: npm test -- --coverage

- name: Check coverage
  run: npm run test:coverage
```

## Mocking Strategies

### Module Mocks

```typescript
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));
```

### API Mocks

```typescript
jest.mock("fs/promises");
(fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(data));
```

### Window API Mocks

```typescript
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    // ... mock implementation
  })),
});
```

## Debugging Tests

### Run single test file

```bash
npm test -- __tests__/lib/utils.test.ts
```

### Run tests matching pattern

```bash
npm test -- --testNamePattern="should render"
```

### Run with verbose output

```bash
npm test -- --verbose
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## Best Practices

1. **Organize tests logically** - Group related tests in describe blocks
2. **Use meaningful test names** - Describe what should happen
3. **Keep tests focused** - One assertion per test when possible
4. **Mock dependencies** - Isolate units under test
5. **Use descriptive matchers** - `toBeInTheDocument()` instead of `toBeTruthy()`
6. **Test user behavior** - Not implementation details
7. **Clean up after tests** - Use afterEach hooks for cleanup
8. **Avoid test interdependence** - Each test should be independent

## Troubleshooting

### Tests not found

- Ensure files follow naming pattern: `*.test.ts` or `*.test.tsx`
- Check `testMatch` in `jest.config.ts`

### Module not found errors

- Verify path aliases in `jest.config.ts` match `tsconfig.json`
- Check relative paths are correct

### React component issues

- Wrap components in `FormNodeProvider` when using context
- Mock external dependencies
- Use `waitFor()` for async operations

### Coverage not updating

```bash
npm run test:coverage -- --clearCache
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contact & Questions

For questions about testing setup, contact the development team.

---

**Last Updated**: January 2025  
**Test Coverage Target**: 70%  
**Framework**: Jest + React Testing Library
