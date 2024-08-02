
## Version 1.10.0 (2024-08-01)
** New Features and Improvements **

- Set human readable label to product facet
- Don't set order state at order creation so it fallback to default state
- Moved approval rule creation together with other appravals methods
- Set correct name for approvals and drafts
- Added missing approval rules dynamic handler
- Added data-source handlers for approval flows and rules
- Added routers for approval rules and flows
- Aligned names with other routers
- Added schemas for approval rules and flows and remove previews
- Removes JSON.parse duct tape
- Undefined cart or empty rejectors
- Added a method to find master data sorce and comments on private data access
- Added spare parts data source, product id to product types, mappers
- Added types for data-sourced on B2B and removed duplicated code for categories
- Added type map for reference and aligned types

## Version 1.9.0 (2024-06-28)

** New Features and Improvements **

## Version 1.8.0 (2024-06-24)

** New Features and Improvements **
- Handle default sorting attributes on B2B
- Handle when not matching variants exist on product mapper
- Included method to handle search sorting products
- Support localized attribute
- Update productId field
- Update interface naming
- Fix matchingVariants undefined error
- Use markMatchingVariant for price filter

** Bug fixes **
- Handle boolean facets and verify when they are selected

## Version 1.7.1 (2024-06-06)

** New Features and Improvements **

* Added business unit create and reject approval flow actions
* Created busniess unit queryApprovalRules, updateApprovalRule and queryApprovalFlows actions
* Added business unit createApprovalRule action
* Removed unsetting of split shipping after adding line items
* Added missing distribution and supply channel when adding items on a recreated cart

## Version 1.7.0 (2024-05-16)

** New Features and Improvements **

- Adds deserialization to queryParams sortAttributes helper

** Bug fixes **

- Modified quote filter to use the accountId only when requested

- Modified order filter to use the accountId only when requested

## Version 1.6.1 (2024-05-09)

** New Features and Improements **

- Set either customersId or anonymousId when cart is recreated
- Setting default channels on login

## Version 1.6.0 (2024-04-26)

** New Features and Improvements **

- Restructured, reorganized folders

## Version 1.5.0 (2024-04-04)

** New Features and Improvements **

- Added store key

## Version 1.4.0 (2024-02-22)

** New Features and Improvements **

- Replaced get wishlists with query wishlists
- Added endpoint to clear the cart from the session 
- Replaced get wishlists with query wishlist

** Bug fixes **

- Return channel information as part of store in getBusinessUnit action

## Version 1.3.0 (2024-01-24)

** New Features and Improvements **

- Implemented index and session storage for Pages
- Added dynamic page handlers from ordes and quotes
- Add filter query params
- Modified the verification mail for b2b associate

** Bug fixes **

- Parse body before use it in cart fetcher

## Version 1.2.0 (2023-10-24)

** New Features and Improvements **

- Cleanup deprecated code
- Add generic paginated result type and support custom queries in search filters
- Get category slug using regex
- Add filters and sort for orders
- Implement handling for quote request along with quotes dynamic page
- Ensured associated are not mapped as undefined for business units
- Allowed business unit and store from body and throw exception if cart cannot be fetched

** Bug fixes **

- Handle order dynamic pages as orders instead of carts
- Added cart path reference

## Version 1.1.0 (2023-09-27)

** New Features and Improvements **

- Refactor B2B functionalities

## Version 1.0.0 (2023-05-24)

** New Features and Improvements **

- Initial release
