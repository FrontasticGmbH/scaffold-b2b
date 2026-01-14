# @commercetools-frontend/b2b-launchpad

## 2.0.0

### Major Changes

-   c0e3135: # Major Upgrade: Next.js 16, React 19, Storybook 10, and ESLint 9

    ## Breaking Changes

    ### Next.js 16 Upgrade

    -   Upgraded Next.js from `15.2.4` to `16.0.7` with security patches
    -   Upgraded React from `19.0.0` to `19.2.1`
    -   Upgraded React-DOM to `19.2.1`
    -   Migrated `next.config.js` to `next.config.mjs` (ES modules)
    -   Updated image configuration: `domains` → `remotePatterns`

    ### next-intl v4 Upgrade

    -   Upgraded next-intl from `3.26.5` to `4.0.0`
    -   Updated type augmentation from `IntlMessages` interface to `AppConfig` module augmentation
    -   Added strictly-typed `Locale` to `AppConfig`

    ### ESLint 9 Flat Config Migration

    Migrated from ESLint 8 legacy `.eslintrc.js` to ESLint 9 flat config (`eslint.config.mjs`):

    -   Completely rewrote ESLint configuration using flat config format
    -   Migrated from CommonJS to ES modules (`.mjs`)
    -   Updated all plugin imports to use new ESM syntax
    -   Configured for React 19 with automatic runtime detection

    ### Storybook 10 Upgrade

    -   Upgraded from Storybook 8.6.9 → 10.1.2
    -   Framework Switch: `@storybook/nextjs` (Webpack) → `@storybook/nextjs-vite` (Vite)
    -   Migrated from Webpack to Vite for faster builds
    -   Fixed path alias resolution for TypeScript imports in Storybook

    ### Dependency Changes

    -   Replaced `next-client-cookies` with `js-cookie` for client-side cookie operations
    -   Upgraded `react-day-picker` from `8.10.1` to `9.11.3` for React 19 compatibility
    -   Upgraded `@netlify/plugin-nextjs` from `5.10.1` to `5.15.1` for Next.js 16 compatibility

    ## Security Updates

    ### CVE-2025-55182 & CVE-2025-66478 - Critical RCE Vulnerability

    **Severity:** Critical (CVSS 10.0)
    **Status:** ✅ PATCHED

    Critical security patches for remote code execution (RCE) vulnerabilities in React Server Components:

    -   **CVE-2025-55182** (React): Affects React 19.0.0, 19.1.0, 19.1.1, 19.2.0
    -   **CVE-2025-66478** (Next.js): Affects Next.js ≥15.x, ≥16.x, ≥14.3.0-canary.77

    **Patched Versions Applied:**

    -   Next.js: `16.0.7`
    -   React: `19.2.1`
    -   React-DOM: `19.2.1`

    ## Bug Fixes

    ### Component Fixes

    -   **Dropdown Component**: Fixed TypeScript error where `handleChange` function now properly handles both `string` and `Option` types
    -   **Date Picker Components**: Updated for react-day-picker v9 API compatibility
    -   **Hydration Fixes**: Resolved hydration mismatches in theme attributes and media queries

    ### Build & Configuration

    -   Fixed Storybook build by properly configuring TypeScript path aliases for Vite
    -   Fixed Netlify deployment "Cannot find module turbopack runtime" error
    -   Fixed `next.config.js` crash when `COMMIT_REF` is undefined
    -   Updated TypeScript `moduleResolution` to `bundler`
    -   Fixed CSS import order in stylesheets

    ## Migration Notes

    ### For Developers

    1. **Install Dependencies**: Run `yarn install` to update all packages
    2. **Clean Build**: Clear `.next` directory before building (`rm -rf .next`)
    3. **ESLint Config**: Delete old `.eslintrc.js` if present (now using `eslint.config.mjs`)
    4. **React Day Picker**: Update any custom components using `react-day-picker` to use the v9 API
    5. **Cookies**: Replace `next-client-cookies` with `js-cookie` for client-side operations
    6. **IDE/Editor**: Restart your IDE to pick up new ESLint flat config format

    ### Type Augmentation Changes

    Update custom type augmentations for next-intl:

    ```typescript
    // Before (v3)
    declare global {
        interface IntlMessages extends Messages {}
    }

    // After (v4)
    declare module 'next-intl' {
        interface AppConfig {
            Messages: Messages
            Locale: Locale
        }
    }
    ```

    ### Breaking API Changes

    -   `cookies()` API in Next.js 16 is now async and must be awaited
    -   ICU message arguments in next-intl v4 cannot be `null`, `undefined`, or `boolean`
    -   ESLint 8 `.eslintrc.js` format is no longer supported (use flat config)

    ## Performance Improvements

    -   Leverages Next.js 16's improved routing and caching
    -   Storybook builds significantly faster with Vite (vs previous Webpack)
    -   ESLint 9 with `projectService` provides better type-checking performance
    -   Reduced hydration errors improve initial page render performance

    ## Verification

    **All Systems Operational:**

    -   ✅ **Build**: Next.js production build successful
    -   ✅ **Tests**: All Jest tests passing
    -   ✅ **Lint**: ESLint 9 - 0 errors
    -   ✅ **Storybook**: Dev mode and builds working
    -   ✅ **Security**: CVE-2025-55182 vulnerability patched
    -   ✅ **Type Safety**: All TypeScript compilation successful
    -   ✅ **Deployment**: Netlify compatibility verified

    ## Summary

    | Component            | Before     | After           | Status        |
    | -------------------- | ---------- | --------------- | ------------- |
    | **Next.js**          | 15.2.4     | 16.0.7          | ✅ Patched    |
    | **React**            | 19.0.0     | 19.2.1          | ✅ Patched    |
    | **Storybook**        | 8.6.9      | 10.1.2          | ✅ Working    |
    | **ESLint**           | 8 (legacy) | 9 (flat config) | ✅ Clean      |
    | **next-intl**        | 3.26.5     | 4.0.0           | ✅ Type-safe  |
    | **react-day-picker** | 8.10.1     | 9.11.3          | ✅ Compatible |

### Patch Changes

-   63090dd: Fix Jest tests and hydration warnings after Next.js 16 upgrade

    **Fixes:**

    -   Restore usePath hook contract to maintain compatibility with existing components
    -   Update Jest configuration to support next-intl v4 ES modules
    -   Add next-intl/navigation and next-intl/routing mocks for Jest tests
    -   Add suppressHydrationWarning to HeadlessUI components (Dropdown, Select, Combobox) to fix React 19 hydration warnings

## 1.2.3

### Patch Changes

-   cd70978: Axios security vulnerability fixed

## 1.2.2

### Patch Changes

-   084fe54: Updated the versions of react and react-dom packages

## 1.2.1

### Patch Changes

-   cb72597: Modify the items count on the purchase list page
-   1b0a7f4: Bumped NextJs version to 15.2.6 to fix a security vulnerability.
    Replaced isomorphic-dompurify with dompurify to fix security vulnerability.
-   414c252: Included recurring princes on cart line items
-   e7c49a8: Bump esbuild package to fix security issue

## 1.2.0

### Minor Changes

-   6f5aab5: Display before and after shipping prices in checkout when shipping discount is applied. Shows original price with strikethrough and discounted price in green. Layout is responsive: stacked on mobile, inline on desktop.
    -   Discount code display and messaging from Merchant Center
    -   Free shipping threshold handling across cart and checkout
    -   Discount summary alignment and formatting
    -   Mobile responsive improvements for discount sections
    -   Quote checkout discount display
-   1147af1: Added multiple discounts handling functionality.

### Patch Changes

-   dfd97ff: Implement Locale type for defaultLocale and improve Localization handling to support language and language+country
-   7a2c9e1: Refactored all mapper files to use `LocalizedValue.getLocalizedValue()` instead of directly accessing `[locale.language]`. This ensures proper fallback to defaultLocale when translations are missing, improving localization accuracy and user experience.
-   d76a939: Validate object exist before mapping recurring data

## 1.1.0

### Minor Changes

-   e27d142: Add method to remove and add recurrence info from line items

### Patch Changes

-   50899cf: Fix logs and bump nanoid package to fix security issue
-   1977d61: Streamline recurrence policy handling in CartMapper

## 1.0.0

### Major Changes

-   f83523e: Initial release of a package for the B2B Launchpad
