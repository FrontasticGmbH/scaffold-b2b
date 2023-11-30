type GetBusinessUnitQuery = {
	key: string;
};

type GetBusinessUnitsQuery = {
	expandStores?: boolean;
};

type UpdateBusinessUnitQuery = {
	key: string;
};

type RemoveBusinessUnitQuery = {
	key: string;
};

type AddAssociateQuery = {
	/*
	 * Business unit key
	 **/
	key: string;
};

type UpdateAssociateQuery = {
	key: string;
};

type RemoveAssociateQuery = {
	key: string;
};

type GetBusinessUnitOrdersQuery = {
	key: string;
};

type AddBusinessUnitAddressQuery = {
	key: string;
};

type UpdateBusinessUnitAddressQuery = {
	key: string;
};

type RemoveBusinessUnitAddressQuery = {
	key: string;
};

export {
	type GetBusinessUnitQuery,
	type GetBusinessUnitsQuery,
	type UpdateBusinessUnitQuery,
	type RemoveBusinessUnitQuery,
	type AddAssociateQuery,
	type UpdateAssociateQuery,
	type RemoveAssociateQuery,
	type GetBusinessUnitOrdersQuery,
	type AddBusinessUnitAddressQuery,
	type UpdateBusinessUnitAddressQuery,
	type RemoveBusinessUnitAddressQuery,
};
