import { SDKResponse, ServerOptions } from "@commercetools/frontend-sdk";
import { Account } from "@shared/types/account";
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
} from "../payloads/AccountPayloads";
import { LoginAccountQuery, RegisterAccountQuery, RequestAccountConfirmationEmailQuery  } from "../../types/queries/AccountQueries";

type GetAccountActionReturn =
	| {
			loggedIn: false;
	  }
	| {
			loggedIn: true;
			account: Account;
	  };

type GetAccountAction = (options?: {
	serverOptions?: ServerOptions;
}) => Promise<SDKResponse<GetAccountActionReturn>>;

type LoginAccountAction = (
	payload: LoginAccountPayload,
    query?: LoginAccountQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type LogoutAccountAction = (options?: {
	serverOptions?: ServerOptions;
}) => Promise<SDKResponse<void>>;

type RegisterAccountAction = (
	payload: RegisterAccountPayload,
    query?: RegisterAccountQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type ConfirmAccountAction = (
	payload: ConfirmAccountPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type RequestAccountConfirmationEmailAction = (
	payload: RequestAccountConfirmationEmailPayload,
    query?: RequestAccountConfirmationEmailQuery,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<void>>;

type ChangeAccountPasswordAction = (
	payload: ChangeAccountPasswordPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type RequestAccountPasswordResetAction = (
	payload: RequestAccountPasswordResetPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<void>>;

type ResetAccountPasswordAction = (
	payload: ResetAccountPasswordPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type UpdateAccountAction = (
	payload: UpdateAccountPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type AddAccountAddressAction = (
	payload: AddAccountAddressPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type UpdateAccountAddressAction = (
	payload: UpdateAccountAddressPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type AddAccountBillingAddressAction = (
	payload: AddAccountBillingAddressPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type AddAccountShippingAddressAction = (
	payload: AddAccountShippingAddressPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type RemoveAccountAddressAction = (
	payload: RemoveAccountAddressPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type SetDefaultAccountBillingAddressAction = (
	payload: SetDefaultAccountBillingAddressPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type SetDefaultAccountShippingAddressAction = (
	payload: SetDefaultAccountShippingAddressPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<Account>>;

type DeleteAccountAction = (
	payload: DeleteAccountPayload,
	options?: {
		serverOptions?: ServerOptions;
	}
) => Promise<SDKResponse<void>>;

export {
	type GetAccountActionReturn,
	type GetAccountAction,
	type LoginAccountAction,
	type LogoutAccountAction,
	type RegisterAccountAction,
	type ConfirmAccountAction,
	type RequestAccountConfirmationEmailAction,
	type ChangeAccountPasswordAction,
	type RequestAccountPasswordResetAction,
	type ResetAccountPasswordAction,
	type UpdateAccountAction,
	type AddAccountAddressAction,
	type UpdateAccountAddressAction,
	type AddAccountBillingAddressAction,
	type AddAccountShippingAddressAction,
	type RemoveAccountAddressAction,
	type SetDefaultAccountBillingAddressAction,
	type SetDefaultAccountShippingAddressAction,
	type DeleteAccountAction,
};
