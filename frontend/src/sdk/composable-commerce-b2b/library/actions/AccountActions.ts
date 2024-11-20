import { rememberMeCookie, SDK, ServerOptions } from '@commercetools/frontend-sdk';
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
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<GetAccountActionReturn>({
        actionName: 'account/getAccount',
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    login: async (
      payload: LoginAccountPayload,
      query?: LoginAccountQuery,
      options: {
        parallel?: boolean;
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
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });

      if (response.isError === false) {
        if (remember) {
          await rememberMeCookie.set(true, options.serverOptions);
        }
      }

      return response;
    },
    logout: async (
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'account/logout',
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      if (response.isError === false) {
        await rememberMeCookie.remove(options.serverOptions);
      }
      return response;
    },
    register: async (
      payload: RegisterAccountPayload,
      query?: RegisterAccountQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/register',
        payload,
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    confirm: async (
      payload: ConfirmAccountPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/confirm',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    requestConfirmationEmail: async (
      payload: RequestAccountConfirmationEmailPayload,
      query?: RequestAccountConfirmationEmailQuery,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'account/requestConfirmationEmail',
        payload,
        query,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    changePassword: async (
      payload: ChangeAccountPasswordPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/password',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    requestPasswordReset: async (
      payload: RequestAccountPasswordResetPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'account/requestReset',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    resetPassword: async (
      payload: ResetAccountPasswordPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/reset',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateAccount: async (
      payload: UpdateAccountPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/update',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addAddress: async (
      payload: AddAccountAddressPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/addAddress',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    updateAddress: async (
      payload: UpdateAccountAddressPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/updateAddress',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addBillingAddress: async (
      payload: AddAccountBillingAddressPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/addBillingAddress',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    addShippingAddress: async (
      payload: AddAccountShippingAddressPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/addShippingAddress',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    removeAddress: async (
      payload: RemoveAccountAddressPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/removeAddress',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    setDefaultBillingAddress: async (
      payload: SetDefaultAccountBillingAddressPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/setDefaultBillingAddress',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    setDefaultShippingAddress: async (
      payload: SetDefaultAccountShippingAddressPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<Account>({
        actionName: 'account/setDefaultShippingAddress',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
    deleteAccount: async (
      payload: DeleteAccountPayload,
      options: {
        parallel?: boolean;
        customHeaderValue?: string;
        serverOptions?: ServerOptions;
      } = {},
    ) => {
      const response = await sdk.callAction<void>({
        actionName: 'account/deleteAccount',
        payload,
        parallel: options.parallel,
        customHeaderValue: options.customHeaderValue,
        serverOptions: options.serverOptions,
      });
      return response;
    },
  };
};
