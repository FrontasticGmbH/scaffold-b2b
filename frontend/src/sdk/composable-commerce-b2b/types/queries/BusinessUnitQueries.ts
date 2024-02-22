type GetBusinessUnitQuery = {
  businessUnitKey: string;
};

type GetBusinessUnitsQuery = {
  expandStores?: boolean;
};

type UpdateBusinessUnitQuery = {
  businessUnitKey: string;
};

type GetAssociateQuery = {
  businessUnitKey: string;
};

type AddAssociateQuery = {
  businessUnitKey: string;
};

type UpdateAssociateQuery = {
  businessUnitKey: string;
};

type RemoveAssociateQuery = {
  businessUnitKey: string;
};

type GetBusinessUnitOrdersQuery = {
  businessUnitKey: string;
};

type AddBusinessUnitAddressQuery = {
  businessUnitKey: string;
};

type UpdateBusinessUnitAddressQuery = {
  businessUnitKey: string;
};

type RemoveBusinessUnitAddressQuery = {
  businessUnitKey: string;
};

type SetBusinessUnitAndStoreKeysQuery = {
  businessUnitKey: string;
  storeKey: string;
};

export {
  type GetBusinessUnitQuery,
  type GetBusinessUnitsQuery,
  type UpdateBusinessUnitQuery,
  type GetAssociateQuery,
  type AddAssociateQuery,
  type UpdateAssociateQuery,
  type RemoveAssociateQuery,
  type GetBusinessUnitOrdersQuery,
  type AddBusinessUnitAddressQuery,
  type UpdateBusinessUnitAddressQuery,
  type RemoveBusinessUnitAddressQuery,
  type SetBusinessUnitAndStoreKeysQuery,
};
