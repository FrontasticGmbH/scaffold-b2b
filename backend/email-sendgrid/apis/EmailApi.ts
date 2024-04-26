import { Context } from '@frontastic/extension-types';
import SendgridClient from '@sendgrid/mail';
import { Account } from '@Types/account/Account';
import { Order } from '@Types/cart/Order';
import { formatPrice } from '../utils/Price';

export class EmailApi {
  client: typeof SendgridClient;

  locale?: string;

  configuration: {
    sender: string;
    clientHost: string;
    templateIds: Record<string, string>;
  };

  constructor(commercetoolsFrontendContext: Context, locale?: string) {
    this.client = SendgridClient;
    this.client.setApiKey(commercetoolsFrontendContext.project.configuration.sendgrid.apiKey);

    this.locale = locale;

    this.configuration = {
      sender: commercetoolsFrontendContext.project.configuration.sendgrid.sender,
      clientHost: commercetoolsFrontendContext.project.configuration.sendgrid.client_host,
      templateIds: commercetoolsFrontendContext.project.configuration.sendgrid.templateIds,
    };
  }

  async sendAccountVerificationEmail(customer: Account) {
    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [customer.email],
          dynamicTemplateData: {
            customer,
            url: `${this.configuration.clientHost}/verify?token=${customer.confirmationToken.token}`,
          },
        },
      ],
      templateId: this.configuration.templateIds.accountVerification,
    });
  }

  async sendPasswordResetEmail(customer: Account, token: string) {
    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [customer.email],
          dynamicTemplateData: {
            customer,
            url: `${this.configuration.clientHost}/reset-password?token=${token}`,
          },
        },
      ],
      templateId: this.configuration.templateIds.passwordReset,
    });
  }

  async sendOrderConfirmationEmail(order: Order) {
    const locale = this.locale?.replace('_', '-');

    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [order.email],
          dynamicTemplateData: {
            order: {
              ...order,
              formattedTotalPrice: formatPrice(order.sum, locale),
              lineItems: order.lineItems.map((lineItem) => ({
                ...lineItem,
                formattedPrice: formatPrice(lineItem.totalPrice, locale),
                imageUrl: lineItem.variant.images[0],
              })),
              shippingInfo: {
                ...order.shippingInfo,
                formattedPrice: formatPrice(order.shippingInfo?.price, locale),
              },
            },
          },
        },
      ],
      templateId: this.configuration.templateIds.orderConfirmation,
    });
  }

  async sendWelcomeCustomerEmail(customer: Account) {
    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [customer.email],
          dynamicTemplateData: { customer },
        },
      ],
      templateId: this.configuration.templateIds.welcomeCustomer,
    });
  }

  async sendAccountDeletionEmail(customer: Account) {
    await this.client.send({
      from: this.configuration.sender,
      personalizations: [
        {
          to: [customer.email],
          dynamicTemplateData: { customer },
        },
      ],
      templateId: this.configuration.templateIds.accountDeletion,
    });
  }
}
