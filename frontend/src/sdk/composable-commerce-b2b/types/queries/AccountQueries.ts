type LoginAccountQuery = {
    storeKey?: string;
    businessUnitKey?: string;
};

type RegisterAccountQuery = {
    storeKey?: string;
    businessUnitKey?: string;
};

type RequestAccountConfirmationEmailQuery = {
    storeKey?: string;
    businessUnitKey?: string;
};

export { type LoginAccountQuery, type RegisterAccountQuery, type RequestAccountConfirmationEmailQuery };
