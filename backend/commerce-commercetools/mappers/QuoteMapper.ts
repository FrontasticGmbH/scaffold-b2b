import {
  Quote as CommercetoolsQuote,
  QuoteRequest as CommercetoolsQuoteRequest,
  QuoteRequestState as CommercetoolsQuoteRequestState,
  QuoteState as CommercetoolsQuoteState,
} from '@commercetools/platform-sdk';
import { QuoteRequest, QuoteRequestState } from '@Types/quote/QuoteRequest';
import { Quote, QuoteState } from '@Types/quote/Quote';
import CartMapper from './CartMapper';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import AccountMapper from '@Commerce-commercetools/mappers/AccountMapper';
import ProductMapper from '@Commerce-commercetools/mappers/ProductMapper';

export default class QuoteMapper {
  static commercetoolsQuoteToQuote(
    commercetoolsQuote: CommercetoolsQuote,
    locale: Locale,
    defaultLocale: string,
  ): Quote {
    const quoteRequest = commercetoolsQuote.quoteRequest?.obj
      ? this.commercetoolsQuoteRequestToQuoteRequest(commercetoolsQuote.quoteRequest.obj, locale, defaultLocale)
      : undefined;

    return {
      quoteId: commercetoolsQuote.id,
      key: commercetoolsQuote.key,
      quoteState: this.commercetoolsQuoteStateToQuoteState(commercetoolsQuote.quoteState),
      createdAt: new Date(commercetoolsQuote.createdAt),
      lastModifiedAt: new Date(commercetoolsQuote.lastModifiedAt),
      account: {
        accountId: commercetoolsQuote.customer.id,
        firstName: commercetoolsQuote.customer.obj?.firstName,
        lastName: commercetoolsQuote.customer.obj?.lastName,
      },
      lineItems: CartMapper.commercetoolsLineItemsToLineItems(commercetoolsQuote.lineItems, locale, defaultLocale),
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsQuote.totalPrice),
      tax: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsQuote.taxedPrice),
      taxed: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsQuote.taxedPrice),
      buyerComment: commercetoolsQuote.buyerComment,
      sellerComment: commercetoolsQuote.sellerComment,
      purchaseOrderNumber: commercetoolsQuote.purchaseOrderNumber,
      expirationDate: new Date(commercetoolsQuote.validTo),
      quoteRequest: quoteRequest,
      quoteVersion: commercetoolsQuote.version,
      quotationCart: commercetoolsQuote.stagedQuote?.obj?.quotationCart?.obj
        ? CartMapper.commercetoolsCartToCart(
            commercetoolsQuote.stagedQuote?.obj.quotationCart.obj,
            locale,
            defaultLocale,
          )
        : undefined,
    };
  }

  static commercetoolsQuoteRequestToQuoteRequest(
    commercetoolsQuoteRequest: CommercetoolsQuoteRequest,
    locale: Locale,
    defaultLocale: string,
  ): QuoteRequest {
    return {
      quoteRequestId: commercetoolsQuoteRequest.id,
      key: commercetoolsQuoteRequest.key,
      createdAt: new Date(commercetoolsQuoteRequest.createdAt),
      lastModifiedAt: new Date(commercetoolsQuoteRequest.lastModifiedAt),
      account: {
        accountId: commercetoolsQuoteRequest.customer.id,
        firstName: commercetoolsQuoteRequest.customer.obj?.firstName,
        lastName: commercetoolsQuoteRequest.customer.obj?.lastName,
      },
      buyerComment: commercetoolsQuoteRequest.comment,
      purchaseOrderNumber: commercetoolsQuoteRequest.purchaseOrderNumber,
      store: { key: commercetoolsQuoteRequest.store.key },
      businessUnit: { key: commercetoolsQuoteRequest.businessUnit.key },
      lineItems: CartMapper.commercetoolsLineItemsToLineItems(
        commercetoolsQuoteRequest.lineItems,
        locale,
        defaultLocale,
      ),
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsQuoteRequest.totalPrice),
      tax: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsQuoteRequest.taxedPrice),
      taxed: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsQuoteRequest.taxedPrice),
      shippingAddress: AccountMapper.commercetoolsAddressToAddress(commercetoolsQuoteRequest.shippingAddress),
      billingAddress: AccountMapper.commercetoolsAddressToAddress(commercetoolsQuoteRequest.billingAddress),
      quoteRequestState: this.commercetoolsQuoteStateToQuoteDraftState(commercetoolsQuoteRequest.quoteRequestState),
      itemShippingAddresses: commercetoolsQuoteRequest.itemShippingAddresses.map((itemShippingAddress) =>
        AccountMapper.commercetoolsAddressToAddress(itemShippingAddress),
      ),
      quoteRequestVersion: commercetoolsQuoteRequest.version,
    };
  }

  static commercetoolsQuoteStateToQuoteDraftState(
    commercetoolsQuoteState: CommercetoolsQuoteRequestState,
  ): QuoteRequestState {
    let quoteDraftState: QuoteRequestState;

    switch (true) {
      case commercetoolsQuoteState === 'Accepted':
        quoteDraftState = QuoteRequestState.Accepted;
        break;
      case commercetoolsQuoteState === 'Cancelled':
        quoteDraftState = QuoteRequestState.Cancelled;
        break;
      case commercetoolsQuoteState === 'Closed':
        quoteDraftState = QuoteRequestState.Closed;
        break;
      case commercetoolsQuoteState === 'Rejected':
        quoteDraftState = QuoteRequestState.Rejected;
        break;
      default:
        break;
    }

    return quoteDraftState;
  }

  static commercetoolsQuoteStateToQuoteState(commercetoolsQuoteState: CommercetoolsQuoteState): QuoteState {
    let quoteState: QuoteState;

    switch (true) {
      case commercetoolsQuoteState === 'Accepted':
        quoteState = QuoteState.Accepted;
        break;
      case commercetoolsQuoteState === 'Declined':
        quoteState = QuoteState.Declined;
        break;
      case commercetoolsQuoteState === 'DeclinedForRenegotiation':
        quoteState = QuoteState.DeclinedForRenegotiation;
        break;
      case commercetoolsQuoteState === 'RenegotiationAddressed':
        quoteState = QuoteState.RenegotiationAddressed;
        break;
      case commercetoolsQuoteState === 'Failed':
        quoteState = QuoteState.Failed;
        break;
      case commercetoolsQuoteState === 'Pending':
        quoteState = QuoteState.Pending;
        break;
      case commercetoolsQuoteState === 'Withdrawn':
        quoteState = QuoteState.Withdrawn;
        break;
      default:
        break;
    }

    return quoteState;
  }
}
