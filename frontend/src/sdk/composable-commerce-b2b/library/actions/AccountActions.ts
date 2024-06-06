import { rememberMeCookieAsync, SDK, ServerOptions } from '@commercetools/frontend-sdk';
import {
  GetAccountActionReturn,
  GetAccountAction,
  LoginAccountAction,
  LogoutAccountAction,
  RegisterAccountAction,
  ConfirmAccountAction,
  RequestAccountConfirmationEmailAction,
  ChangeAccountPasswordAction,
  RequestAccountPasswordResetAction,
  ResetAccountPasswordAction,
  UpdateAccountAction,
  AddAccountAddressAction,
  UpdateAccountAddressAction,
  AddAccountBillingAddressAction,
  AddAccountShippingAddressAction,
  RemoveAccountAddressAction,
  SetDefaultAccountBillingAddressAction,
  SetDefaultAccountShippingAddressAction,
  DeleteAccountAction,
} from '../../types/actions/AccountActions';
import {
  LoginAccountPayload,
  RegisterAccountPayload,
  ConfirmAccountPayload,
  RequestAccountConfirmationEmailPayload,
  ChangeAccountPasswordPayload,
  RequestAccountPasswordResetPayload,
  ResetAccountPasswordPayload,
  UpdateAccountPayload,
  AddAccountAddressPayload,
  UpdateAccountAddressPayload,
  AddAccountBillingAddressPayload,
  AddAccountShippingAddressPayload,
  RemoveAccountAddressPayload,
  SetDefaultAccountBillingAddressPayload,
  SetDefaultAccountShippingAddressPayload,
  DeleteAccountPayload,
} from '../../types/payloads/AccountPayloads';
import { ComposableCommerceEventsB2B } from '../../types/events/ComposableCommerceEventsB2B';
import { Account } from '@shared/types/account';
import {
  LoginAccountQuery,
  RegisterAccountQuery,
  RequestAccountConfirmationEmailQuery,
} from '../../types/queries/AccountQueries';

export type AccountActions = {
  getAccount: GetAccountAction;
  login: LoginAccountAction;
  logout: LogoutAccountAction;
  register: RegisterAccountAction;
  confirm: ConfirmAccountAction;
  requestConfirmationEmail: RequestAccountConfirmationEmailAction;
  changePassword: ChangeAccountPasswordAction;
  requestPasswordReset: RequestAccountPasswordResetAction;
  resetPassword: ResetAccountPasswordAction;
  updateAccount: UpdateAccountAction;
  addAddress: AddAccountAddressAction;
  updateAddress: UpdateAccountAddressAction;
  addBillingAddress: AddAccountBillingAddressAction;
  addShippingAddress: AddAccountShippingAddressAction;
  removeAddress: RemoveAccountAddressAction;
  setDefaultBillingAddress: SetDefaultAccountBillingAddressAction;
  setDefaultShippingAddress: SetDefaultAccountShippingAddressAction;
  deleteAccount: DeleteAccountAction;
};

export const getAccountActions = (sdk: SDK<ComposableCommerceEventsB2B>): AccountActions => {
  return {
    getAccount: async (
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<GetAccountActionReturn>({
        actionName: 'account/getAccount',
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    login: async (
      payload: LoginAccountPayload,
      query?: LoginAccountQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const remember = payload.remember;
      payload.remember = undefined;

      const response = await sdk.callAction<Account>({
        actionName: 'account/login',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (response.isError === false) {
        if (remember) {
          await rememberMeCookieAsync.set(true, options.serverOptions);
        }
      }

      return response;
    },
    logout: async (
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'account/logout',
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      if (response.isError === false) {
        await rememberMeCookieAsync.remove(options.serverOptions);
      }
      return response;
    },
    register: async (
      payload: RegisterAccountPayload,
      query?: RegisterAccountQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/register',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    confirm: async (
      payload: ConfirmAccountPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/confirm',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    requestConfirmationEmail: async (
      payload: RequestAccountConfirmationEmailPayload,
      query?: RequestAccountConfirmationEmailQuery,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'account/requestConfirmationEmail',
        payload,
        query,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    changePassword: async (
      payload: ChangeAccountPasswordPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/password',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    requestPasswordReset: async (
      payload: RequestAccountPasswordResetPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'account/requestReset',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    resetPassword: async (
      payload: ResetAccountPasswordPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/reset',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateAccount: async (
      payload: UpdateAccountPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/update',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addAddress: async (
      payload: AddAccountAddressPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/addAddress',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateAddress: async (
      payload: UpdateAccountAddressPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/updateAddress',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addBillingAddress: async (
      payload: AddAccountBillingAddressPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/addBillingAddress',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addShippingAddress: async (
      payload: AddAccountShippingAddressPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/addShippingAddress',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    removeAddress: async (
      payload: RemoveAccountAddressPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/removeAddress',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    setDefaultBillingAddress: async (
      payload: SetDefaultAccountBillingAddressPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/setDefaultBillingAddress',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    setDefaultShippingAddress: async (
      payload: SetDefaultAccountShippingAddressPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/setDefaultShippingAddress',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    deleteAccount: async (
      payload: DeleteAccountPayload,
      options: {
        skipQueue?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'account/deleteAccount',
        payload,
        skipQueue: options.skipQueue,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
  };
};
