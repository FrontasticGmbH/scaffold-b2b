# B2B Launchpad

A Store Launchpad for B2B Manufacturing built with commercetools Frontend and Composable Commerce, designed according to digital commerce UX and UI best practices for business-to-business scenarios.

## Overview

This B2B Launchpad is a commercetools Frontend template for creating B2B commerce websites. It consists of Frontend components, extensions, and types that leverage features and functionalities from [commercetools Composable Commerce](https://docs.commercetools.com/docs/composable-commerce) and [commercetools Frontend](https://docs.commercetools.com/docs/frontend).

**Key Technologies:**

- **Frontend**: Node.js 24 with Next.js 15 and React 19
- **Backend**: Node.js 24 with commercetools Composable Commerce integration
- **Email**: SendGrid and SMTP support for transactional emails

## Main Template Elements

The B2B Launchpad includes the following B2B-specific components:

- **Homepage** with merchandising features (hero banner, categories, brands, blogs)
- **Business Unit Registration** page for creating Business Units
- **Login Page** for administrators and buyers
- **Account Pages** including:
  - **Business Unit and Store Selector** for switching between accessible units
  - **Quotes Page** for viewing and filtering quotes and quote requests
  - **Quote Details Page** for viewing quote data and initiating checkout
  - **Orders Page** for viewing and accessing order details
  - **Order Details Page** for viewing order data and reordering
  - **Company Admin Page** for managing addresses, Associates, and Business Units
  - **Purchase Lists Page** for managing purchase lists
  - **Settings and Security Page** for general settings management
  - **Approval Rules Page** for creating and managing approval rules
  - **Approval Flows Page** for managing pending orders in approval process
  - **Addresses Page** for managing Business Unit addresses
- **Search and Product Listing** pages
- **Product Details** page
- **Quick Order Menu** for bulk ordering
- **Cart** and **Checkout** pages
- **Navigation Menu**, **Language Selector**, **Header**, and **Footer**

## Key Features

- **Business Unit Management** for multi-organizational structures
- **Quote Management** with approval workflows
- **Approval Flows** for controlled purchasing processes
- **Role-based Access Control** for administrators and buyers
- **Order Management** with detailed tracking and reordering
- **Multi-language Support** for international business operations
- **Responsive Design** optimized for B2B workflows
- **Advanced Search** and product catalog management

Built with modern web technologies following commercetools best practices for B2B commerce scalability and performance.

## Getting Started

### Prerequisites

The following should be installed locally:

- Homebrew for macOS or Linux
- scoop for Windows
- Node.js (version 24.x)
- Yarn (version 4.4.1)

### 1. Install the CLI

The CLI is our command-line interface that you can use for development. To install the latest version of the CLI, open a command-line tool and run one of the following commands based on your operating system.

**For macOS and Linux:**

```bash
brew tap frontasticgmbh/tap && brew install frontastic-cli
```

**For Windows:**

```bash
# Add scoop bucket
scoop bucket add FrontasticGmbH_scoop-bucket https://github.com/FrontasticGmbH/scoop-bucket

# Install frontastic-cli
scoop install frontastic-cli
```

### 2. Get your API token from the Studio

To get your API token from the Studio, follow these steps:

1. From the Studio homepage, click the **Account** icon, then select **Profile**: the **User settings** dialog opens.
2. Copy the value in the **API token** field and close the dialog.
3. Save the copied value for later use.

### 3. Set up your project locally

To set up your project locally, follow these steps:

1. Clone the GitHub repository of your commercetools Frontend project on your computer.
2. Open a command-line tool and move to the root directory of your repository.
3. To initialize your project, run `frontastic init` in your command-line tool: you'll be prompted to enter the Studio user API token.
4. Enter the API token you copied from the Studio.
5. To install the necessary dependencies, run `frontastic install` in your command-line tool.
6. To start your commercetools Frontend project, run `frontastic run` in your command-line tool. Once it has finished, you can preview your website by opening `http://localhost:3000` in a web browser.

### 4. Start Development

You can now start developing your project in your favorite IDE. The project structure includes:

- **Frontend components**: Located in `frontend/src/components/`
- **Backend extensions**: Located in `backend/` with various integrations
- **Types**: Shared TypeScript definitions in `types/`

For more information, see the [official B2B Store Launchpad documentation](https://docs.commercetools.com/frontend-development/b2b-store-launchpad-overview) and [commercetools Frontend development guide](https://docs.commercetools.com/frontend-getting-started/developing-with-commercetools-frontend).
