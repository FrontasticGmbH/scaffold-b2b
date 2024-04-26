
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
