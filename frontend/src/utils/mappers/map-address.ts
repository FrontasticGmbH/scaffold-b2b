import { Address } from '@shared/types/account/Address';
import { Address as EntityAddress } from '@/types/entity/address';

export const mapAddress = ({
  addressId,
  firstName,
  lastName,
  streetName,
  additionalStreetInfo,
  city,
  state,
  postalCode,
  country,
  isDefaultBillingAddress,
  isDefaultShippingAddress,
}: Partial<Address>): EntityAddress => {
  return {
    id: addressId as string,
    name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName,
    line1: streetName ?? '',
    line2: additionalStreetInfo ?? '',
    city,
    state,
    zip: postalCode,
    country: country ?? '',
    isDefaultBilling: isDefaultBillingAddress,
    isDefaultShipping: isDefaultShippingAddress,
  };
};

export const mapCoCoAddress = ({
  id,
  name = '',
  line1,
  line2,
  city,
  state,
  zip,
  country,
  isDefaultBilling,
  isDefaultShipping,
}: Partial<EntityAddress>): Address => {
  const firstSpaceIndex = name.indexOf(' ');

  const [firstName, lastName] =
    firstSpaceIndex === -1 ? [name, ''] : [name.slice(0, firstSpaceIndex), name.slice(firstSpaceIndex + 1)];

  return {
    addressId: id,
    firstName,
    lastName,
    streetName: line1,
    additionalAddressInfo: line2,
    city,
    state,
    postalCode: zip,
    country,
    isDefaultBillingAddress: isDefaultBilling,
    isDefaultShippingAddress: isDefaultShipping,
  };
};
