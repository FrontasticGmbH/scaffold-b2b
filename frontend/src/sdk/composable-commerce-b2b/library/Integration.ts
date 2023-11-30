import { Integration, SDK } from "@commercetools/frontend-sdk";
import { getProductActions, ProductActions } from "./actions/ProductActions";
import { getCartActions, CartActions } from "./actions/CartActions";
import { getWishlistActions, WishlistActions } from "./actions/WishlistActions";
import { AccountActions, getAccountActions } from "./actions/AccountActions";
import { ComposableCommerceEventsB2B } from "../types/events/ComposableCommerceEventsB2B";
import { ProjectActions, getProjectActions } from "./actions/ProjectActions";
import { QuoteActions, getQuoteActions } from "./actions/QuoteActions";
import {
	BusinessUnitActions,
	getBusinessUnitActions,
} from "./actions/BusinessUnitActions";

class ComposableCommerceB2B extends Integration<ComposableCommerceEventsB2B> {
	constructor(sdk: SDK<ComposableCommerceEventsB2B>) {
		super(sdk);

		this.account = getAccountActions(sdk);
		this.businessUnit = getBusinessUnitActions(sdk);
		this.cart = getCartActions(sdk);
		this.product = getProductActions(sdk);
		this.project = getProjectActions(sdk);
		this.quote = getQuoteActions(sdk);
		this.wishlist = getWishlistActions(sdk);
	}

	unregisterExtension(): void {}

	account: AccountActions;
	businessUnit: BusinessUnitActions;
	cart: CartActions;
	product: ProductActions;
	project: ProjectActions;
	quote: QuoteActions;
	wishlist: WishlistActions;
}

export { ComposableCommerceB2B };
