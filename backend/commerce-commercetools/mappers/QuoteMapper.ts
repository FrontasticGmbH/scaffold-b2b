import {
  Quote as CommercetoolsQuote,
  QuoteRequest as CommercetoolsQuoteRequest,
  QuoteRequestState as CommercetoolsQuoteRequestState,
  QuoteState as CommercetoolsQuoteState,
  StagedQuote as CommercetoolsStagedQuote,
  StagedQuoteState as CommercetoolsStagedQuoteState,
} from '@commercetools/platform-sdk';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import { CartMapper } from './CartMapper';
import { AccountMapper } from '@Commerce-commercetools/mappers/AccountMapper';
import { QuoteRequest, QuoteRequestState } from '@Types/quote/QuoteRequest';
import { ProductMapper } from '@Commerce-commercetools/mappers/ProductMapper';
import { Quote, QuoteState } from '@Types/quote/Quote';

export class QuoteMapper {
  static commercetoolsQuoteToQuote(commercetoolsQuote: CommercetoolsQuote, locale: Locale): Quote {
    const quoteRequest = commercetoolsQuote.quoteRequest?.obj
      ? this.commercetoolsQuoteRequestToQuoteRequest(commercetoolsQuote.quoteRequest.obj, locale)
      : undefined;

    commercetoolsQuote.stagedQuote?.obj
      ? this.updateQuoteRequestFromCommercetoolsStagedQuote(quoteRequest, commercetoolsQuote.stagedQuote.obj)
      : undefined;

    return {
      quoteId: commercetoolsQuote.id,
      key: commercetoolsQuote.key,
      quoteState: this.commercetoolsQuoteStateToQuoteState(commercetoolsQuote.quoteState),
      createdAt: new Date(commercetoolsQuote.createdAt),
      lastModifiedAt: new Date(commercetoolsQuote.lastModifiedAt),
      lineItems: CartMapper.commercetoolsLineItemsToLineItems(commercetoolsQuote.lineItems, locale),
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsQuote.totalPrice),
      tax: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsQuote.taxedPrice, locale),
      buyerComment: commercetoolsQuote.buyerComment,
      sellerComment: commercetoolsQuote.sellerComment,
      expirationDate: new Date(commercetoolsQuote.validTo),
      quoteRequest: quoteRequest,
      quoteVersion: commercetoolsQuote.version,
    };
  }

  static commercetoolsQuoteRequestToQuoteRequest(
    commercetoolsQuoteRequest: CommercetoolsQuoteRequest,
    locale: Locale,
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
      store: { key: commercetoolsQuoteRequest.store.key },
      businessUnit: { key: commercetoolsQuoteRequest.businessUnit.key },
      lineItems: CartMapper.commercetoolsLineItemsToLineItems(commercetoolsQuoteRequest.lineItems, locale),
      sum: ProductMapper.commercetoolsMoneyToMoney(commercetoolsQuoteRequest.totalPrice),
      tax: CartMapper.commercetoolsTaxedPriceToTaxed(commercetoolsQuoteRequest.taxedPrice, locale),
      shippingAddress: AccountMapper.commercetoolsAddressToAddress(commercetoolsQuoteRequest.shippingAddress),
      billingAddress: AccountMapper.commercetoolsAddressToAddress(commercetoolsQuoteRequest.billingAddress),
      quoteRequestState: this.commercetoolsQuoteStateToQuoteDraftState(commercetoolsQuoteRequest.quoteRequestState),
      itemShippingAddresses: commercetoolsQuoteRequest.itemShippingAddresses.map((itemShippingAddress) =>
        AccountMapper.commercetoolsAddressToAddress(itemShippingAddress),
      ),
      quoteRequestVersion: commercetoolsQuoteRequest.version,
    };
  }

  static updateQuoteRequestFromCommercetoolsStagedQuote(
    quoteRequest: QuoteRequest,
    commercetoolsStagedQuote: CommercetoolsStagedQuote,
  ) {
    quoteRequest.sellerComment = commercetoolsStagedQuote.sellerComment;
    quoteRequest.quoteRequestState = this.commercetoolsQuoteStateToQuoteDraftState(
      commercetoolsStagedQuote.stagedQuoteState,
    );
    quoteRequest.lastModifiedAt = new Date(commercetoolsStagedQuote.lastModifiedAt);
    quoteRequest.expirationDate = new Date(commercetoolsStagedQuote.validTo);
    quoteRequest.quotationCart = {
      cartId: commercetoolsStagedQuote.quotationCart?.id,
    };
  }

  static commercetoolsQuoteStateToQuoteDraftState(
    commercetoolsQuoteState: CommercetoolsQuoteRequestState | CommercetoolsStagedQuoteState,
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
      case commercetoolsQuoteState === 'Submitted':
        quoteDraftState = QuoteRequestState.Submitted;
        break;
      case commercetoolsQuoteState === 'InProgress':
        quoteDraftState = QuoteRequestState.InProgress;
        break;
      case commercetoolsQuoteState === 'Sent':
        quoteDraftState = QuoteRequestState.Sent;
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
