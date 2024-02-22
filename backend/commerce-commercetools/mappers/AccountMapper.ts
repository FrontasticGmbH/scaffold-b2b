import { Account } from '@Types/account/Account';
import { Customer as commercetoolsCustomer } from '@commercetools/platform-sdk';
import { Request } from '@frontastic/extension-types';
import { Address } from '@Types/account';
import {
  Address as CommercetoolsAddress,
  BaseAddress,
} from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';
import { AccountRegisterBody } from '@Commerce-commercetools/actionControllers/AccountController';
import { parseBirthday } from '@Commerce-commercetools/utils/parseBirthday';

export class AccountMapper {
  static commercetoolsCustomerToAccount(commercetoolsCustomer: commercetoolsCustomer): Account {
    return {
      accountId: commercetoolsCustomer.id,
      email: commercetoolsCustomer.email,
      salutation: commercetoolsCustomer?.salutation,
      firstName: commercetoolsCustomer?.firstName,
      lastName: commercetoolsCustomer?.lastName,
      companyName: commercetoolsCustomer?.companyName,
      birthday: commercetoolsCustomer?.dateOfBirth ? new Date(commercetoolsCustomer.dateOfBirth) : undefined,
      confirmed: commercetoolsCustomer.isEmailVerified,
      vatNumber: commercetoolsCustomer?.vatId,
      version: commercetoolsCustomer.version,
      addresses: this.commercetoolsCustomerToAddresses(commercetoolsCustomer),
    } as Account;
  }

  static commercetoolsCustomerToAddresses(commercetoolsCustomer: commercetoolsCustomer): Address[] {
    const addresses: Address[] = [];

    commercetoolsCustomer.addresses.forEach((commercetoolsAddress) => {
      addresses.push({
        ...this.commercetoolsAddressToAddress(commercetoolsAddress),
        isDefaultBillingAddress: commercetoolsAddress.id === commercetoolsCustomer.defaultBillingAddressId,
        isDefaultShippingAddress: commercetoolsAddress.id === commercetoolsCustomer.defaultShippingAddressId,
      } as Address);
    });

    return addresses;
  }

  static commercetoolsAddressToAddress(commercetoolsAddress: CommercetoolsAddress): Address {
    return {
      addressId: commercetoolsAddress.id,
      salutation: commercetoolsAddress.salutation ?? undefined,
      firstName: commercetoolsAddress.firstName ?? undefined,
      lastName: commercetoolsAddress.lastName ?? undefined,
      streetName: commercetoolsAddress.streetName ?? undefined,
      streetNumber: commercetoolsAddress.streetNumber ?? undefined,
      additionalStreetInfo: commercetoolsAddress.additionalStreetInfo ?? undefined,
      additionalAddressInfo: commercetoolsAddress.additionalAddressInfo ?? undefined,
      postalCode: commercetoolsAddress.postalCode ?? undefined,
      city: commercetoolsAddress.city ?? undefined,
      country: commercetoolsAddress.country ?? undefined,
      state: commercetoolsAddress.state ?? undefined,
      phone: commercetoolsAddress.phone ?? undefined,
    };
  }

  static addressToCommercetoolsAddress(address: Address): BaseAddress {
    return {
      id: address.addressId,
      // key: Guid.newGuid(),
      salutation: address.salutation,
      firstName: address.firstName,
      lastName: address.lastName,
      streetName: address.streetName,
      streetNumber: address.streetNumber,
      additionalStreetInfo: address.additionalStreetInfo,
      additionalAddressInfo: address.additionalAddressInfo,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
      state: address.state,
      phone: address.phone,
    } as BaseAddress;
  }

  static requestToAccount(request: Request): Account {
    const accountRegisterBody: AccountRegisterBody = JSON.parse(request.body);

    const account: Account = {
      email: accountRegisterBody?.email,
      confirmed: accountRegisterBody?.confirmed,
      password: accountRegisterBody?.password,
      salutation: accountRegisterBody?.salutation,
      firstName: accountRegisterBody?.firstName,
      lastName: accountRegisterBody?.lastName,
      companyName: accountRegisterBody?.companyName,
      birthday: parseBirthday(accountRegisterBody),
      vatNumber: accountRegisterBody?.vatNumber,
      addresses: [],
    };

    if (accountRegisterBody.billingAddress) {
      accountRegisterBody.billingAddress.isDefaultBillingAddress = true;
      accountRegisterBody.billingAddress.isDefaultShippingAddress = !(
        accountRegisterBody.shippingAddress !== undefined
      );

      account.addresses.push(accountRegisterBody.billingAddress);
    }

    if (accountRegisterBody.shippingAddress) {
      accountRegisterBody.shippingAddress.isDefaultShippingAddress = true;
      accountRegisterBody.shippingAddress.isDefaultBillingAddress = !(accountRegisterBody.billingAddress !== undefined);

      account.addresses.push(accountRegisterBody.shippingAddress);
    }

    return account;
  }
}
