import { Address } from '@shared/types/account/Address';
import { Address as EntityAddress } from '@/types/entity/address';

export const mapAddress = ({
  addressId,
  firstName,
  lastName,
  streetName,
  streetNumber,
  building,
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
    name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '',
    streetName: streetName ?? '',
    streetNumber: streetNumber ?? '',
    building: building ?? '',
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
  streetName,
  streetNumber,
  isDefaultBilling,
  isDefaultShipping,
  building,
  apartment,
}: Partial<EntityAddress>): Address => {
  const firstSpaceIndex = name.indexOf(' ');

  const [firstName, lastName] =
    firstSpaceIndex === -1 ? [name, ''] : [name.slice(0, firstSpaceIndex), name.slice(firstSpaceIndex + 1)];

  return {
    addressId: id,
    firstName,
    lastName,
    streetName: streetName || line1,
    streetNumber: streetNumber ?? '',
    additionalAddressInfo: line2,
    building: building ?? '',
    apartment: apartment ?? '',
    city,
    state,
    postalCode: zip,
    country,
    isDefaultBillingAddress: isDefaultBilling,
    isDefaultShippingAddress: isDefaultShipping,
  };
};
