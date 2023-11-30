import { Account } from '@Types/account/Account';
import { CustomerDraft } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/customer';
import { CartResourceIdentifier } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/cart';
import { BaseAccountApi } from './BaseAccountApi';
import { AccountMapper } from '../mappers/AccountMapper';
import { Cart } from '@Types/cart/Cart';
import { ExternalError } from '@Commerce-commercetools/utils/Errors';
import { Guid } from '@Commerce-commercetools/utils/Guid';

export class AccountApi extends BaseAccountApi {
  create: (account: Account, cart?: Cart | undefined) => Promise<Account> = async (
    account: Account,
    cart?: Cart | undefined,
  ) => {
    const locale = await this.getCommercetoolsLocal();

    const {
      commercetoolsAddresses,
      billingAddresses,
      shippingAddresses,
      defaultBillingAddress,
      defaultShippingAddress,
    } = this.extractAddresses(account);

    const customerDraft: CustomerDraft = {
      key: Guid.newGuid(),
      email: account.email,
      password: account.password,
      salutation: account?.salutation,
      firstName: account?.firstName,
      lastName: account?.lastName,
      companyName: account.companyName,
      dateOfBirth: account?.birthday
        ? account.birthday.getFullYear() + '-' + account.birthday.getMonth() + '-' + account.birthday.getDate()
        : undefined,
      isEmailVerified: account?.confirmed,
      addresses: commercetoolsAddresses.length > 0 ? commercetoolsAddresses : undefined,
      defaultBillingAddress: defaultBillingAddress,
      defaultShippingAddress: defaultShippingAddress,
      billingAddresses: billingAddresses.length > 0 ? billingAddresses : undefined,
      shippingAddresses: shippingAddresses.length > 0 ? shippingAddresses : undefined,
      anonymousCart:
        cart !== undefined
          ? ({
              typeId: 'cart',
              id: cart.cartId,
            } as CartResourceIdentifier)
          : undefined,
    };

    account = await this.requestBuilder()
      .customers()
      .post({
        body: customerDraft,
      })
      .execute()
      .then((response) => {
        return AccountMapper.commercetoolsCustomerToAccount(response.body.customer, locale);
      })
      .catch((error) => {
        if (error.code && error.code === 400) {
          if (error.body && error.body?.errors?.[0]?.code === 'DuplicateField') {
            throw new Error(`The account ${account.email} does already exist.`);
          }

          /*
           * The cart might already belong to another user, so we try to create tje account without the cart.
           */
          if (cart) {
            return this.create(account, undefined);
          }
        }

        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });

    if (!account.confirmed) {
      account.confirmationToken = await this.getConfirmationToken(account);
    }

    return account;
  };

  getAccountByEmail: (email: string) => Promise<Account | null> = async (email: string) => {
    const locale = await this.getCommercetoolsLocal();

    return this.requestBuilder()
      .customers()
      .get({
        queryArgs: {
          where: `email="${email}"`,
          limit: 1,
        },
      })
      .execute()
      .then((response) => {
        if (!response.body.results.length) {
          return null;
        }

        return AccountMapper.commercetoolsCustomerToAccount(response.body.results[0], locale);
      });
  };

  async delete(account: Account) {
    return this.requestBuilder()
      .customers()
      .withId({ ID: account.accountId })
      .delete({
        queryArgs: {
          version: account.version,
          dataErasure: true,
        },
      })
      .execute()
      .then((response) => response.body)
      .catch((error) => {
        throw new ExternalError({ status: error.code, message: error.message, body: error.body });
      });
  }
}
