# @commercetools-frontend/b2b-launchpad

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
