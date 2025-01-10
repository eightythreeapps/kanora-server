# Kanora Server Tests

This directory contains all tests for the Kanora Server project.

## Directory Structure

```
tests/
├── unit/                 # Unit tests
│   ├── services/        # Tests for service layer
│   ├── controllers/     # Tests for controllers
│   ├── entities/        # Tests for entities
│   └── middleware/      # Tests for middleware
├── integration/          # Integration tests
│   ├── services/        # Service integration tests
│   ├── controllers/     # Controller integration tests
│   └── middleware/      # Middleware integration tests
└── fixtures/            # Test fixtures and mock data
```

## Test Types

### Unit Tests
- Located in `unit/`
- Test individual components in isolation
- Use mocks for dependencies
- Follow naming convention: `*.test.ts`

### Integration Tests
- Located in `integration/`
- Test multiple components working together
- Minimal mocking, test real interactions
- Follow naming convention: `*.spec.ts`

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Guidelines

1. Each test file should focus on a single component
2. Use descriptive test names that explain the behavior being tested
3. Follow the AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies in unit tests
5. Use fixtures for complex test data
6. Maintain minimum 80% code coverage 