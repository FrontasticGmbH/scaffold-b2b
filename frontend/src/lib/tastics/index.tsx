import BlogTastic from './blog';
import AccountLoginTastic from './account/login';
import AccountRegisterTastic from './account/register';
import ResetPasswordTastic from './account/reset-password';
import ContentItemsTastic from './content-items';
import ContentTilesTastic from './content-tiles';
import DashboardTastic from './dashboard';
import FooterTastic from './footer';
import HeroTileTastic from './hero-tile';
import NotFoundTastic from './not-found';
import HeaderTastic from './header';
import ProductListTastic from './product-list';
import VerifyTastic from './account/verify';
import VerifyAssociateTastic from './account/verify-associate';
import CartTastic from './cart';
import QuotesTastic from './quotes';
import OrdersTastic from './orders';
import CompanyAdminTastic from './company-admin';
import PurchaseListsTastic from './purchase-lists';
import SettingsTastic from './settings';
import AddressesTastic from './addresses';
import PurchaseListDetailTastic from './purchase-list-detail';
import OrderDetailTastic from './order-detail';
import QuoteDetailTastic from './quote-detail';
import CheckoutTastic from './checkout';
import ThankYouTastic from './thank-you';
import ProductSliderTastic from './product-slider';
import ProductDetailsTastic from './product-details';
import QuoteRequestDetailsTastic from './quote-request-detail';
import QuoteCheckoutTastic from './quote-checkout';
import QuoteThankYouTastic from './quote-thank-you';
import type { TasticRegistry } from './types';

const tastics = {
  'commercetools/ui/content/hero-tile': HeroTileTastic,
  'commercetools/ui/content/content-items': ContentItemsTastic,
  'commercetools/ui/content/content-tiles': ContentTilesTastic,
  'commercetools/ui/footer': FooterTastic,
  'commercetools/ui/dashboard': DashboardTastic,
  'commercetools/ui/not-found': NotFoundTastic,
  'commercetools/ui/content/blog': BlogTastic,
  'commercetools/ui/header': HeaderTastic,
  'commercetools/ui/products/details': ProductDetailsTastic,
  'commercetools/ui/products/product-list': ProductListTastic,
  'commercetools/ui/cart': CartTastic,
  'commercetools/ui/account/login': AccountLoginTastic,
  'commercetools/ui/account/verify': VerifyTastic,
  'commercetools/ui/account/verify-associate': VerifyAssociateTastic,
  'commercetools/ui/account/register': AccountRegisterTastic,
  'commercetools/ui/account/reset-password': ResetPasswordTastic,
  'commercetools/ui/quotes': QuotesTastic,
  'commercetools/ui/orders': OrdersTastic,
  'commercetools/ui/company-admin': CompanyAdminTastic,
  'commercetools/ui/purchase-lists': PurchaseListsTastic,
  'commercetools/ui/settings': SettingsTastic,
  'commercetools/ui/addresses': AddressesTastic,
  'commercetools/ui/purchase-list-detail': PurchaseListDetailTastic,
  'commercetools/ui/order-detail': OrderDetailTastic,
  'commercetools/ui/quote-detail': QuoteDetailTastic,
  'commercetools/ui/quote-request-detail': QuoteRequestDetailsTastic,
  'commercetools/ui/checkout': CheckoutTastic,
  'commercetools/ui/quote-checkout': QuoteCheckoutTastic,
  'commercetools/ui/thank-you': ThankYouTastic,
  'commercetools/ui/quote-thank-you': QuoteThankYouTastic,
  'commercetools/ui/products/product-slider': ProductSliderTastic,
} as TasticRegistry;

export default tastics;
