# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions for automated testing and quality checks with **Bun** as the package manager and runtime. The CI/CD pipeline ensures code quality and prevents broken code from being merged to the main branch.

## Workflow Triggers

The CI/CD pipeline runs automatically when:

- A pull request is created or updated targeting the `main` branch
- Code is pushed directly to the `main` branch

## Jobs

### 1. **Test & Lint Job**

- **Runs on**: Ubuntu latest
- **Runtime**: Bun (latest version)

**Steps**:

1. Checkout code with full history
2. Setup Bun runtime
3. Install dependencies using `bun install`
4. Run ESLint checks: `bun run lint`
5. Run Jest tests with coverage: `bun run test -- --coverage`
6. Build the Next.js project: `bun run build`

**Status**: ❌ Blocks merging if any step fails

### 2. **Coverage Report Job**

- **Runs on**: Ubuntu latest
- **Depends on**: Test & Lint job completion

**Steps**:

1. Generate code coverage report
2. Upload to Codecov for tracking coverage trends
3. Continues on error to not block the pipeline

**Status**: ⚠️ For informational purposes (non-blocking)

### 3. **PR Status Check Job**

- **Runs on**: Pull request events only
- **Depends on**: Test & Lint job

**Purpose**: Provides a final status confirmation that all checks passed

## Coverage Requirements

Based on `jest.config.ts`, the following coverage thresholds must be met:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Files included in coverage:

- `app/**/*.{js,jsx,ts,tsx}`
- `components/**/*.{js,jsx,ts,tsx}`
- `hooks/**/*.{js,jsx,ts,tsx}`
- `lib/**/*.{js,jsx,ts,tsx}`
- `types/**/*.{js,jsx,ts,tsx}`

## Branch Protection Rules (Recommended)

To enforce the CI/CD checks, configure GitHub branch protection rules:

1. Go to **Settings** → **Branches** → **Add rule**
2. Set branch name to `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (at least 1)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require code reviews before merging

4. Select required status checks:
   - `Test & Lint`
   - `Code Coverage Report`

## Local Development

### Running Tests Locally

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage report
bun run test:coverage

# Run linter
bun run lint

# Build project
bun run build
```

### Pre-commit Recommendations

Use a pre-commit hook to run checks before pushing:

```bash
# Install husky and lint-staged (optional)
bun add --save-dev husky lint-staged
bunx husky install
```

Then create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

bun run lint
bun run test -- --bail
```

## Troubleshooting

### Tests Fail in CI but Pass Locally

- Ensure Bun version matches CI environment (latest)
- Clear cache: `rm -rf node_modules bun.lockb && bun install`
- Run: `bun run test:coverage` to check coverage thresholds

### Build Fails in CI

- Check `next.config.ts` for any environment-specific configurations
- Ensure all required environment variables are set in GitHub Secrets
- Run `bun run build` locally to debug

### Linting Errors

- Fix automatically: Review ESLint errors in the workflow output
- Apply fixes: `bun run lint -- --fix`

## Monitoring and Improvements

1. **Check workflow runs**: Actions tab on GitHub
2. **Codecov dashboard**: Track coverage trends over time
3. **Failed PR checks**: Review logs to identify issues
4. **Performance**: Monitor CI/CD execution time and optimize if needed

## Future Enhancements

- Add E2E testing (Playwright, Cypress)
- Add performance benchmarking
- Add security scanning (Snyk, CodeQL)
- Add accessibility testing
- Deploy previews on pull requests
