import { Account, Address } from "@shared/types/account";

type CreateBusinessUnitPayload = {
	account: {
		accountId: string;
		email: string;
		companyName: string;
	};
	store: {
		storeId: string;
	};
};

type UpdateBusinessUnitPayload = {
	name?: string;
	contactEmail?: string;
};

type AddAssociatePayload = {
	email: string;
	roleKeys: string[];
};

type UpdateAssociatePayload = {
	accountId: string;
	roleKeys: string[];
};

type RemoveAssociatePayload = {
	accountId: string;
};

type AddBusinessUnitAddressPayload = {
	address: Address;
};

type UpdateBusinessUnitAddressPayload = {
	address: Address;
};

type RemoveBusinessUnitAddressPayload = {
	addressId: string;
};

export {
	type CreateBusinessUnitPayload,
	type UpdateBusinessUnitPayload,
	type AddAssociatePayload,
	type UpdateAssociatePayload,
	type RemoveAssociatePayload,
	type AddBusinessUnitAddressPayload,
	type UpdateBusinessUnitAddressPayload,
	type RemoveBusinessUnitAddressPayload,
};
