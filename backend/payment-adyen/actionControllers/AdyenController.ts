import { ActionContext, Request, Response } from '@frontastic/extension-types/src/ts/index';
import { CreateSessionDTO, CreateSessionPayload } from './../Session';
import AdyenApi from '../BaseApi';
import { CartApi } from '@Commerce-commercetools/apis/CartApi';
import { Guid } from '../utils/Guid';
import { getCurrency, getLocale } from '../utils/Request';
import { CartFetcher } from '../utils/CartFetcher';
import { Account } from '@Types/account/Account';
import { Payment, PaymentStatuses } from '@Types/cart/Payment';
import { Cart } from '@Types/cart/Cart';

import { hmacValidator } from '@adyen/api-library';
//const { hmacValidator } = require('@adyen/api-library');

export const createSession = async (request: Request, actionContext: ActionContext) => {
  const adyenApi = new AdyenApi(actionContext.frontasticContext.project.configuration.payment.adyen);
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));

  let cart = await CartFetcher.fetchCart(request, actionContext);

  if (cart?.payments?.length == 0) {
    const payment: Payment = {
      id: Guid.newGuid(),
      paymentId: Guid.newGuid(),
      paymentStatus: PaymentStatuses.INIT,
      paymentMethod: '',
      paymentProvider: '',
      amountPlanned: {
        centAmount: 0,
        currencyCode: 'EUR',
      },
    };

    cart = (await cartApi.addPayment(cart, payment)) as Cart;
  }

  const account = (request.sessionData?.account ?? {}) as Account;
  const sessionDTO = JSON.parse(request.body) as CreateSessionDTO;
  const sessionPayload = {
    reference: cart.payments[0].paymentId, //request.sessionData.cartId,
    shopperEmail: account.email,
    shopperLocale: getLocale(request),
    shopperReference: account.accountId,
    ...sessionDTO,
  } as CreateSessionPayload;

  const data = await adyenApi.createSession(sessionPayload);

  const response: Response = {
    statusCode: 200,
    body: JSON.stringify(data),
    sessionData: request.sessionData,
  };
  return response;
};

/*
const createOrderWithPayment = async (request: Request, actionContext: ActionContext, notification: any) => {
  const cartApi = new CartApi(actionContext.frontasticContext, actionContext.frontasticContext.project.defaultLocale);
  const emailApi = new EmailApi(actionContext.frontasticContext);

  let cart = await cartApi.getById(notification.merchantReference);

  const payment: Payment = {
    id: Guid.newGuid(),
    paymentId: notification.merchantReference,
    paymentMethod: notification.paymentMethod,
    paymentStatus: PaymentStatuses.PENDING,
    paymentProvider: notification.pspReference,
    amountPlanned: {
      centAmount: Number(notification.amount.value),
      currencyCode: notification.amount.currency,
    }
  };

  cart = await cartApi.addPayment(cart, payment);

  const order = await cartApi.order(cart);
  await emailApi.sendPaymentConfirmationEmail(order.email);
};
*/

const updateOrderPayment = async (request: Request, actionContext: ActionContext, notification: any) => {
  const cartApi = new CartApi(actionContext.frontasticContext, getLocale(request), getCurrency(request));
  //const emailApi = new EmailApi(actionContext.frontasticContext);

  const paymentDraft: Payment = {
    id: '',
    paymentId: notification.merchantReference,
    paymentMethod: notification.paymentMethod,
    paymentStatus: PaymentStatuses.PENDING,
    paymentProvider: notification.pspReference,
    amountPlanned: {
      centAmount: Number(notification.amount.value),
      currencyCode: notification.amount.currency,
    },
  };

  let payment = await cartApi.getPayment(notification.merchantReference);

  payment = await cartApi.updateOrderPayment(payment.id, paymentDraft);

  //await emailApi.sendPaymentConfirmationEmail(email);
};

export const notifications = async (request: Request, actionContext: ActionContext) => {
  const { notificationItems } = JSON.parse(request.body);
  const hmacKey = actionContext.frontasticContext.project.configuration.payment.adyen.hmacKey;

  const validator = new hmacValidator();

  // @ts-ignore
  notificationItems.forEach(({ NotificationRequestItem }: any) => {
    if (validator.validateHMAC(NotificationRequestItem, hmacKey)) {
      if (NotificationRequestItem.eventCode === 'AUTHORISATION' && NotificationRequestItem.success === 'true') {
        updateOrderPayment(request, actionContext, NotificationRequestItem);
      }
    } else {
      const response: Response = {
        statusCode: 401,
        body: 'Invalid or no HMAC signature',
        sessionData: request.sessionData,
      };
      return response;
    }
  });

  const response: Response = {
    statusCode: 200,
    body: '[accepted]',
    sessionData: request.sessionData,
  };
  return response;
};
