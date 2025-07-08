
## Version 4.6.0 (2025-06-24)

** New Features & Improvements **

- Order status enchancements
- Seo information for dynamic pages


** Bug Fixes **

- update message for returned orders
- seo meta info bug
- type issues for storybook
- use localized path for categories in Breadcrumbs

## Version 4.5.0 (2025-06-09)

** New Features & Improvements **

- Added aria-label for associate name and new translation for unspecified names
- Update storybook config 
- Replace environment variable with a variable in component schema

** Bug Fixes **

- Updated label for checkout url
- Remove enableCtCheckout from Quotes checkout
- Refresh page on checkout
- Fix dashboard translated titles

## Version 4.4.0 (2025-05-27)


** New Features & Improvements **

- Update translations(b2b)
- Modify shopping list delete functionality
- Add required asterisk without browser validation
- Fix form accessiblity errors
- Fix more lint errors
- Fix lint errors
- Add copy and modal changes
- Update permissions
- Error message handling for purchase list add form
- Error message handling for purchase list add form
- Error message handling for company admin associate form
- Error message handling for company admin business unit form
- Error message handling for company admin general info form
- Error message handling for purchase list form
- Error message handling for personal info form
- Error message handling for purchase order form
- Error message handling for discount form
- Error message handling for login form
- Error message handling for register form
- Error message handling for reset password form
- Error message handling for associate verification form
- Add create and edit permission handling
- Error message handling for approval flows
- Update shopping list creation logic
- Implement shopping list ui changes

## Version 4.3.0 (2025-05-12)

** New Features & Improvements **

- Have approval rules split into tabs
- Updating address tests
- Migration to react hooks form
- Add category banner component to B2B
- Iimplemented dynamic filter support for products
- Implemented dynamic filters for category
- Using react hooks form for delete account form


** Bug Fixes **

- Fix approval rules tabs bug
- Fix border radius for banner component


** New Features & Improvements **

- Adjust a11y user facing documentation

** Bug Fixes **

- Fix alt text set in studio not taking effect

## Version 4.1.0 (2025-04-07)

** New Features & Improvements **

- Accessible date picker input component
- Add support for embedding iframes in markdown
- Fix navigation alignment issues
- Simplifies datepicker and fixes type issues
- Dependency upgrade
- Rule builder adjustments for tier hierarchy
- Updated cart and shipping info structures to use taxRate instead of taxIncludedInPrice, and enhance shipping method handling
- B2B end to end tests update
- Upgrade nextjs to 15.2.3
- Add image priority settings
- Enhancements on rule builder & tier hirerarchy rule builder case
- Remove the Typography component

** Bug Fixes **

- Set fixed height for vertical slider container
- Add Meta import to accessibility docs in Storybook
- Replace divs to buttons for better semantics and accessibility.
- Update gh workflows
- Approval rules issues with tier hierarchy
- Adapt search placeholder text for mobile
- B2C, B2B screen reader fixes
- Remove duplicate slashes in URL when switching locale
- Fix drawer a11y issues B2C
- Filter out non matching variants on PDP
- Filter out non matching variants on PLP

## Version 4.0.0 (2025-03-17)

** New Features & Improvements **

- update translations and fixtures
- Add e2e tests for country & locale selection
- merge master & resolve conflicts
- Use next-cloudinary for cloudinary images
- use next-intl - migration
- catch exceptions when updating session

** Bug Fixes **

- set the order Id instead of order when or order cancellation
- adapted according to PR feedback
- Session update bug fix

## Version 3.2.1 (2025-03-04)

** New Features & Improvements **

- Refactor localiation issue in map category

## Version 3.2.0 (2025-03-03)

** New Features & Improvements **

- Fix accessibility issues
- Upgrade to headless ui V2
- List keyboard navigation EAA
- Fix b2b translations
- Reload page when locale changes
- Unify env usage
- Update ref usage
- Avoid duplicate get cart request

** Bug Fixes **

- Fix B2B categories response cache

## Version 3.1.0 (2025-02-17)

** New Features & Improvements **

- Updated translations
- PDP shipping methods section redesign
- Fixed skipped header level
- Added links to product in quote and checkout order summaries
- Add desktop-only message
- Improve accessibility for clickable elements
- Change to Typography
- Improve accessibility for clickable elements
- Add desktop-only message
- Change name to HeaderCell
- Remove isButtonsHead reference
- Remove isButtonsHead references
- Remove isHeadCell references
- Move sorting to button
- Create TableHeadCell component
- Modify table responsiveness
- Imported discont changes from B2C to B2B

** Bug Fixes **

- Fixes shipping method entity type
- Fixes shipping method types and display structure
- Improve TablePagination accessibility and styling

## Version 3.0.0 (2025-02-03)

** New Features & Improvements **

- Add "Clear" translation and fix search button labels
- Modify responsiveness implementation
- Add responsiveness to pagination
- Add responsiveness to tables with mobile view
- Make approval flows table responsive
- Make quotes table responsive
- Upgrade Node JS version
- Fix table header error
- Button component updates
- Simplify color configuration for dropdown focus
- Add gray-400 color to Tailwind and default theme
- Update CSS classes to replace 'color-' with 'text-'
- Update styles to use standardized color palette
- Refactor color system to use semantic class names
- Add Storybook accessibility addon and update dependencies
- Add 404 to authentication whitelist

** Bug Fixes **

- Fix broken preview
- Nextjs15 upgrade done
- Fix keyboard navigation issues for a11y
- Dashboard background change for sidebar

## Version 2.2.0 (2025-01-13)

** New Features & Improvements **

- Improve unit test coverage.
- Enable keyboard navigation for sidebar keyboard navigation
- Use translation for aria labels
- Handle locale changes when on PLP

** Bug Fixes **

- Handle email not found errors in password reset flow.
- Fetch categories correctly on server
- Fixed heading alerts

## Version 2.1.0 (2024-12-16)

** New Features & Improvements **

- Added unit tests for useValidate and Redirect components
- Added domain types to composable commerce events
- Size images properly

** Bug Fixes **

- Added toast message to create new wishlist
- Added toast to create new wishlist
- Consider max quantity to be added to cart

## Version 2.0.0 (2024-11-20)

** New Features & Improvements **

misc: [B2B][B2C] Update translations bundle
feat: restored yarn 4 dependency
feat(FP-7985): Change quote text
Revert "fix(B2B/B2C): FP-7881 removes yarn 4 requirement and general package manager lockin"
feat(FP-8027): [B2B] Persistent business unit bugs in session
Revert "feat(FP-7380): Added duplication validation for rule name"
feat(FP-7085): update quote thank you page
feat: Updated @commercetools/frontend-sdk package to version 2.0.0 stable
misc: [B2B] Update lockfile
misc: [B2B] Fix build
feat(FP-7985): Add purchase order to normal checkout
refactor(FP-8115): [B2C][B2B] Address SDK V2 changes
feat(FP-8027): [B2B] Remove parallel call on homepage
feat(FP-7380): Added duplication validation for rule name
Removed erronously autognerated yarn 4.5 config
misc: Tagged release 1.13.0 for components-nextjs-b2b
feat(FP-7085): update quote thank you page
Added additional event logging to CommercetoolsSDK template
Fixed merge conflicts
feat: Updated to latest alpha version of the coFE SDK v2
feat: updated to use alpha v2 of the coFE SDK

** Bug Fixes **

fix(b2b/b2c): adds postbuild to npm build script
fix(b2b): removes redundant and problematic includes from tsconfig
fix: approval flows rejection bugs
fix(FP-8066): [B2B] Eager load LCP in homepage
fix: readability
fix(b2b): cleans up package.json, removes package manager lockin, storybook deps
fix(b2b): fixes storybook env vars & next.js mocks
fix: adds crossenv
fix: adds crossenv
fix: readability
fix(b2b): cleans up package.json, removes package manager lockin, storybook deps
fix(b2b): fixes storybook env vars & next.js mocks
fix(FP-8132): [B2B][B2C] Run API calls in parallel
fix: Stopped redaction handling changing reponse returned
fix: Fixed issue where redaction handling was redacting returned data
fix: Fixed issue where redaction handling was redacting returned data
fix: changed skipQueue to parallel in SDk integration actions
fix: changed skipQueue to parallel in SDk integration actions
fix(FP-8027): [B2B] Potential fix for wrong session bu
fix(FP-6678): Password error handling
fix: regenerated yarn.lock for v4 wth new sdk version

## Version 1.13.0 (2024-11-05)

** New Features and Improvements **

- Enhance error messages for account verification
- Make password reset fields required
- Added password pattern validation
- Handled multi level category and included categoryId and categoryRef fields

** Bug fixes **

- Purchase list buttons ui bug
- Refresh categories on locale change
- Adjust shipping price default in pdp

## Version 1.12.0 (2024-10-02)

** New Features and Improvements **

- Upgrades to support version Next.js version 14.2.9, React v18.3.1, Yarn4 .4.1 and Typescript version 5.5.4
- Updates to approval flows UI to support multiple rules on an order
- Modify conditions for showing logout button

** Bug fixes **

- Modify conditions for showing logout button
- Fix toaster empty box rendering bug

## Version 1.11.0 (2024-08-30)

** New Features and Improvements **

- Added unit tests for all atoms, molecules and organisms, majority of hooks
- Hide download invoice button from mobile
- Payment only integration handle payments failure gracefully
- Updated ReadMe & Add intro storybook page
- Configure Lighthouse CI in netlify.toml

** Bugs fixes **

- Cart item number fixed based on both products and number of items in each product
- Update fallback Image conditions

## Version 1.11.0 (2024-08-15)

## Version 1.10.0 (2024-08-01)

## Version 1.9.1 (2024-06-28)

** New Features and Improvements **

- User is able to set theme in studio via project configuration

## Version 1.9.0 (2024-06-28)

** New Features and Improvements **

## Version 1.8.0 (2024-06-24)

** New Features and Improvements **

- Move theme application to layout
- Add theme selection through studio
- Updated @commercetools/frontend-sdk dependency to 1.13.1
- Approval rule listing page restored
- Rule builder component restored
- Granular permissions for quotes restored
- Approval rule listing page
- Multiple themes support
- Rule builder component

## Version 1.7.6 (2024-06-06)

## Version 1.7.5 (2024-05-16)

** New Features & Improvements **

- Add more descriptive error messages during registration

** Big Fixes **

- Fix fixtures issue for `quote-checkout` and `quote-thankyou`
- Fix latest order are not visible on dashboard
- Fix SDK server calls were not cached on a request basis
- Fix issue with locale is a prefix of page path
- Adjust .editconfig style to match prettier styles
- Fix checkout session is stalled after applicationKey is changed

## Version 1.7.4 (2024-05-09).

** New Features and Improvements **

- Update path correction in middleware
- Clear client cache upon logging out to fix stall data bugs
- Add more info logs for datasources and studio page data in development mode
- Add missing tastic warning banner in development mode
- Add hyper link for cart items
- Fix selecting addresses in checkout bugs
- Move translation files to `src` folder and load them on server instead over network
- Updated @commercetools/frontend-sdk dependency to version 1.11.2
- Error handling for missing taxes during checkout
- Fixed container overflow for PDP
- Update template.csv for quick order
- Buf fix when adding new address during checkout
- Fix review order button typography on quote checkout
- Log Frontastic ID for each page to browser console

## Version 1.7.3 (2024-04-26)

** New Features and Improvements **

- Shipping list renamed to purchase list
- Algolia search in header, product listing page and search page changed to commercetools search

## Version 1.7.2 (2024-04-18)

** New Features and Improvements **

- Rebranded B2B storybook

## Version 1.7.1 (2024-04-04)

** Bug fixes **

- Fixed category types

## Version 1.7 (2024-04-03)

** New Features and Improvements **

- Added user roles and permissions
- Introduced manufactoring products
- Added a bunch of languages with translations
- Updated Mailgun credentials

## Version 1.6.0 (2024-02-22)

** New Features and Improvements **

- Added quote.getQuotationCart action
- Adjust formatting for quote IDs
- Add env config to nextjs config
- Remove seller comment from quote
- Remove netlify plugin from b2b/b2c

## Version 1.5.3 (2024-02-09)

** New Features and Improvements **

- User can initiate the quote request process
- Quotes request details page is available
- Buyers can decline, renegotiate or accept revised quotes
- User can review order details page
- User can filter orders in order summary list page

** Bug fixes **

- After user logins in he is redirected to homepage, no more blank screen, need to refresh page
- Password reset was not showing password was changed succesfully page, now it does

## Version 1.5.2 (2024-02-02)

** New Features and Improvements **

** Bug fixes **

- User is able to change/update product quantity in purchase list
- User is able to add item to cart from wishlist

## Version 1.5.1 (2024-01-26)

** New Features and Improvemnets **

- Implemented order summary

** Bug fixes **

- Fixed wishlist bugs

## Version 1.5 (2024-01-24)

** New Features and Improvements **

- User is able to add product to one or multiple wishlists
- Store key is being passed to product query when user search products

** Bug fixes **

- Fixed all images
- Missing component tastics added to fixture, header links are fixed
  

## Version 1.4.0 (2024-01-08)

- backporting latest b2b changes
- feat: added missing fields on query order type for SDK
- [B2B] Correct cart layout

## Version 1.3.0 (2023-12-07)

** Features and Improvements **

- Checkout improvements
- Added thank you component (storybook)

** Bug fixes **

- UI & func. bug fixes in PLP
- UI & func. bug fixes in company admin pages

## Version 1.2.0 (2023-11-22)

** Features and improvements **

- Updated B2B SDK integration
- Removed husky
- Added typechecking to dev commands

** Bug fixes **

- Fixed type error
- Modified removeAddress action payload

** New Features and Improvements **

- Cleanup deprecated code
- Implemented new components

** Bug fixes **

- Use lineitems as payload when adding product to cart
- Get missing data to decline and accept quotes
- Get poNumber from payload
