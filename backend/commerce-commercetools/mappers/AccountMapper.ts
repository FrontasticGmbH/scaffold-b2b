import { Account } from '@Types/account/Account';
import { Customer as commercetoolsCustomer } from '@commercetools/platform-sdk';
import { Locale } from '@Commerce-commercetools/interfaces/Locale';
import { BaseAccountMapper } from './BaseAccountMapper';
import { AccountRegisterBody } from '@Commerce-commercetools/actionControllers/AccountController';
import { parseBirthday } from '@Commerce-commercetools/utils/parseBirthday';
import { Request } from '@frontastic/extension-types';

export class AccountMapper extends BaseAccountMapper {
  static commercetoolsCustomerToAccount(commercetoolsCustomer: commercetoolsCustomer, locale: Locale): Account {
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
      addresses: this.commercetoolsCustomerToAddresses(commercetoolsCustomer, locale),
    } as Account;
  }

  static commercetoolsCustomerToSmallerAccount(commercetoolsCustomer: commercetoolsCustomer): Account {
    return {
      accountId: commercetoolsCustomer.id,
      email: commercetoolsCustomer.email,
      salutation: commercetoolsCustomer?.salutation,
      firstName: commercetoolsCustomer?.firstName,
      lastName: commercetoolsCustomer?.lastName,
      confirmed: commercetoolsCustomer.isEmailVerified,
    };
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

// Override the BaseMapper with new Mapper functions
Object.getOwnPropertyNames(AccountMapper).forEach((key) => {
  if (typeof AccountMapper[key] === 'function') {
    BaseAccountMapper[key] = AccountMapper[key];
  }
});
