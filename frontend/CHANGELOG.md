
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

* backporting latest b2b changes
* feat: added missing fields on query order type for SDK
* [B2B] Correct cart layout

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
