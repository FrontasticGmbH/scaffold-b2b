import * as AccountActions from './AccountController';
import * as ProductAction from './ProductController';
import * as WishlistAction from './WishlistController';
import * as QuoteAction from './QuoteController';
import * as ProjectActions from './ProjectController';
import * as BusinessUnitActions from './BusinessUnitController';
import * as CartActions from './CartController';

export const actions = {
  account: AccountActions,
  cart: CartActions,
  'business-unit': BusinessUnitActions,
  product: ProductAction,
  wishlist: WishlistAction,
  quote: QuoteAction,
  project: ProjectActions,
};
