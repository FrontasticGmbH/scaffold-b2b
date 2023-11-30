import { Address } from "@shared/types/account";

type LoginAccountPayload = {
	email: string;
	password: string;
	remember?: boolean;
};

type RegisterAccountPayload = {
	email: string;
	password: string;
	confirmed?: boolean;
	salutation?: string;
	firstName?: string;
	lastName?: string;
	companyName?: string;
	birthdayYear?: string;
	birthdayMonth?: string;
	birthdayDay?: string;
	vatNumber?: string;
	billngAddress?: Address;
	shippingAddress?: Address;
};

type ConfirmAccountPayload = {
	token: string;
};

type RequestAccountConfirmationEmailPayload = {
	email: string;
	password: string;
};

type ChangeAccountPasswordPayload = {
	oldPassword: string;
	newPassword: string;
};

type RequestAccountPasswordResetPayload = {
	email: string;
};

type ResetAccountPasswordPayload = {
	token: string;
	newPassword: string;
};

type UpdateAccountPayload = {
	email?: string;
	password?: string;
	confirmed?: boolean;
	salutation?: string;
	firstName?: string;
	lastName?: string;
	companyName?: string;
	birthdayYear?: string;
	birthdayMonth?: string;
	birthdayDay?: string;
	vatNumber?: string;
	billngAddress?: Address;
	shippingAddress?: Address;
};

type AddAccountAddressPayload = {
	address: Address;
};

type UpdateAccountAddressPayload = {
	address: Address;
};

type AddAccountBillingAddressPayload = {
	address: Address;
};

type AddAccountShippingAddressPayload = {
	address: Address;
};

type RemoveAccountAddressPayload = {
	address: { id: string };
};

type SetDefaultAccountBillingAddressPayload = {
	addressId: string;
};

type SetDefaultAccountShippingAddressPayload = {
	addressId: string;
};

type DeleteAccountPayload = {
	password: string;
};

export {
	type LoginAccountPayload,
	type RegisterAccountPayload,
	type ConfirmAccountPayload,
	type RequestAccountConfirmationEmailPayload,
	type ChangeAccountPasswordPayload,
	type RequestAccountPasswordResetPayload,
	type ResetAccountPasswordPayload,
	type UpdateAccountPayload,
	type AddAccountAddressPayload,
	type UpdateAccountAddressPayload,
	type AddAccountBillingAddressPayload,
	type AddAccountShippingAddressPayload,
	type RemoveAccountAddressPayload,
	type SetDefaultAccountBillingAddressPayload,
	type SetDefaultAccountShippingAddressPayload,
	type DeleteAccountPayload,
};
