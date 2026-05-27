# Jest & Testing Configuration Reference

## Configuration Files

### jest.config.ts

- Main Jest configuration file
- Enables Next.js integration
- Configures module path aliases (@/\*)
- Sets coverage thresholds to 70%
- Specifies test environment (jsdom)

### jest.setup.ts

- Test environment setup
- Mocks window.matchMedia
- Mocks next/navigation
- Imports @testing-library/jest-dom matchers

## NPM Scripts

Add these scripts to your workflow:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Quick Reference

### Run Commands

```bash
npm test                    # Run all tests once
npm run test:watch         # Watch mode - auto-rerun on changes
npm run test:coverage      # Generate coverage report
```

### Test-Specific Commands

```bash
npm test -- utils.test.ts                    # Single file
npm test -- --testNamePattern="className"    # Matching pattern
npm test -- --verbose                        # Detailed output
npm test -- --clearCache                     # Clear Jest cache
```

### Coverage Commands

```bash
npm run test:coverage                        # Full coverage report
npm run test:coverage -- --silent            # Silent mode
npm run test:coverage -- --collectCoverageFrom="src/**"  # Custom path
```

## Configuration Summary

| Setting             | Value                                   | Purpose                       |
| ------------------- | --------------------------------------- | ----------------------------- |
| testEnvironment     | jsdom                                   | Browser-like test environment |
| coverageThreshold   | 70%                                     | Minimum coverage requirement  |
| moduleNameMapper    | @/\*                                    | Path alias resolution         |
| setupFilesAfterEnv  | jest.setup.ts                           | Pre-test setup                |
| collectCoverageFrom | app/, components/, hooks/, lib/, types/ | Coverage targets              |

## File Structure for New Tests

Follow this structure when creating new tests:

```
__tests__/
└── [source-path]/
    └── [module-name].test.ts|tsx
```

Example:

- Source: `components/flows/flow.tsx`
- Test: `__tests__/components/flows/flow.test.tsx`

## Test File Naming

- Use `.test.ts` for utility/hook tests
- Use `.test.tsx` for component tests
- Prefix with descriptive name: `[module].test.ts`

## Mocking Pattern

### Mock a module

```typescript
jest.mock('@/path/to/module', () => ({
  exportedFunction: jest.fn(),
}));
```

### Mock a file system operation

```typescript
jest.mock('fs/promises');
(fs.readFile as jest.Mock).mockResolvedValue('data');
```

### Mock window/global

```typescript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    // mock implementation
  })),
});
```

## Common Assertions

```typescript
// Element presence
expect(screen.getByText('text')).toBeInTheDocument();
expect(screen.getByTestId('id')).toBeVisible();

// Element properties
expect(element).toHaveAttribute('href', '/path');
expect(element).toHaveClass('active');
expect(input).toHaveValue('text');

// Function calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(1);

// State changes
expect(element).toBeChecked();
expect(element).toBeDisabled();
expect(element).toBeVisible();
```

## Testing Library Utilities

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Render component
render(<MyComponent />);

// Query elements
screen.getByText("text")
screen.getByTestId("id")
screen.getByRole("button")
screen.queryByText("text")     // Returns null if not found
screen.findByText("text")      // Async, waits for element

// Fire events
fireEvent.click(element)
fireEvent.change(input, { target: { value: "text" } })

// User interactions
await userEvent.type(input, "text")
await userEvent.click(element)

// Wait for changes
await waitFor(() => {
  expect(element).toBeInTheDocument();
});
```

## Coverage Report Analysis

### View Coverage Report

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

### Coverage Metrics

- **Statements**: Individual statements executed
- **Branches**: If/else and ternary paths taken
- **Functions**: Function calls executed
- **Lines**: Lines of code executed

### Improving Coverage

1. Run `npm run test:coverage` to identify gaps
2. Look at lines marked as red in HTML report
3. Add tests for uncovered paths
4. Re-run coverage to verify improvement

## Performance Tips

1. **Use --testPathPattern** to run subset of tests

   ```bash
   npm test -- --testPathPattern="components"
   ```

2. **Use --maxWorkers** to control parallelization

   ```bash
   npm test -- --maxWorkers=4
   ```

3. **Skip certain files in coverage**
   Edit `jest.config.ts` `collectCoverageFrom`

4. **Use watch mode** during development
   ```bash
   npm run test:watch
   ```

## Troubleshooting

| Issue                | Solution                                          |
| -------------------- | ------------------------------------------------- |
| Module not found     | Check path aliases in jest.config.ts              |
| Tests not found      | Ensure .test.ts or .test.tsx naming               |
| Module mocking fails | Verify mock path matches import path              |
| React warnings       | Check FormNodeProvider wrapping                   |
| Async timeouts       | Increase Jest timeout or use jest.useFakeTimers() |

## IDE Integration

### VS Code

1. Install Jest extension
2. Add to `.vscode/settings.json`:

```json
{
  "jest.autoRun": "off"
}
```

### Running in Debugger

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

---

**Quick Command Reference Sheet**

```bash
# Essential Commands
npm install              # Install dependencies
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Useful Commands
npm test -- --verbose              # Detailed output
npm test -- utils.test.ts          # Single file
npm test -- --testNamePattern="className"  # Pattern match
npm test -- --clearCache           # Clear cache
```

---

**Target Coverage**: 70% | **Current**: ~87%
