# B2B Launchpad Backend

> :information_source: Full documentation can be found [Here](https://docs.commercetools.com/frontend-development/b2b-store-launchpad-overview)

This is a commercetools Launchpad backend project that provides a unified extension system for integrating various commerce, content, and email services specifically designed for B2B ecommerce scenarios.

# Getting Started With Backend Extensions:

## 1- Start the development environment

### Running locally in development mode

```
yarn install
yarn extensions:watch
```

### Building for production

```
yarn install
yarn build
```

### Running tests

```
yarn test
```

### Type checking

```
yarn ts-compile
```

### Watch mode for type checking

```
yarn ts-watch
```

## 2- Available Extensions

The B2B backend includes several pre-built extensions focused on business-to-business commerce:

### Commerce Extensions
- **commerce-commercetools**: commercetools platform integration with B2B-specific features like:
  - Business Unit management
  - Associate roles and permissions
  - Approval workflows
  - Quote requests and management
  - Purchase order processing

### Content Extensions
- **content-contentful**: Contentful CMS integration for B2B content management

### Email Extensions
- **email-smtp**: SMTP email integration for business communications
- **email-sendgrid**: SendGrid email service integration for transactional emails

### Testing Extensions
- **extensions-runner-test**: Health checks and integration testing utilities

## 3- Create a new extension

### Under `/packages/backend/{{extension-name}}/`

- Create an `index.ts` with the extension structure:

```typescript
import { ExtensionRegistry } from '@frontastic/extension-types';

const extension: ExtensionRegistry = {
  'data-sources': {
    // Your data sources here
  },
  'actions': {
    'my-namespace': {
      // Your action controllers here
    }
  },
  'dynamic-page-handler': async (request, dynamicPageContext) => {
    // Your dynamic page handling logic here
    return null;
  }
};

export default extension;
```

- Create your APIs under `apis/` directory
- Create your action controllers under `actionControllers/` directory
- Create utilities under `utils/` directory
- Add mappers under `mappers/` directory if needed

## 4- Register your extension

### In the main `/packages/backend/index.ts`

Import your extension:
```typescript
import myExtension from '@My-extension';
```

Add it to the extensions array:
```typescript
const extensionsToMerge = [
  commercetoolsExtension,
  contentfulExtensions,
  appHealthExtension,
  myExtension, // Add your extension here
] as Array<ExtensionRegistry>;
```

## 5- Extension Structure

Each extension typically includes:

- **APIs**: Core business logic and external service integrations
- **Action Controllers**: HTTP request handlers that use the APIs
- **Mappers**: Data transformation utilities
- **Utils**: Helper functions and utilities
- **Schemas**: TypeScript interfaces and validation schemas
- **Errors**: Custom error types

### Example B2B Action Controller

```typescript
import { ActionContext, Request } from '@frontastic/extension-types';

export const getBusinessUnit = async (request: Request, actionContext: ActionContext) => {
  // Your B2B action logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ data: 'your business unit response' }),
  };
};
```

### B2B-Specific Features

The B2B backend supports advanced business features:

- **Business Units**: Manage organizational hierarchies
- **Associates**: Handle user roles and permissions within business units
- **Approval Workflows**: Configure multi-step approval processes
- **Quote Management**: Handle quote requests and negotiations
- **Purchase Orders**: Process B2B purchase workflows

## That's it! Your extension is now integrated into the B2B backend system.

<br />
<hr />
<br />

## Testing

This project uses Jest for testing with forced exit for B2B integration tests. Tests are located in the `_test/` directory.

To run tests:
```
yarn test
```

Test files should follow the naming convention: `*.test.ts`

### Example test structure:
```typescript
import { describe, test, expect } from '@jest/globals';

describe('My B2B Extension', () => {
  test('should handle business unit correctly', () => {
    expect(true).toBe(true);
  });
});
```

## Documentation

The project includes comprehensive documentation:

- **demo-docs/**: Example implementations and documentation
- **doc-schemas/**: Schema documentation and examples

## Linting

This project uses ESLint with TypeScript support and Prettier integration for code quality and formatting.

To run the linter:
```
yarn lint
```

To fix errors that can be automatically fixed:
```
yarn lint:fix
```

We recommend adding linting directly to your code editor or development environment for immediate feedback.

### Configuration files:
- `.eslintrc.json`: ESLint configuration
- `.eslintignore`: Files to ignore during linting

## Prettier / Code formatting

Prettier is integrated with the linter. When running `yarn lint:fix`, your code will be auto-formatted.

To format all TypeScript files:
```
yarn format
```

### Configuration files:
- `.prettierrc.json`: Prettier configuration
- `.prettierignore`: Files to ignore during formatting

We recommend setting up your editor to format documents on save using Prettier.

## Building

The project uses `tsup` for building. Configuration is in `tsup.config.ts`.

To build for production:
```
yarn build
```

This will create a bundled output in the `build/` directory that can be deployed to your B2B environment. 
