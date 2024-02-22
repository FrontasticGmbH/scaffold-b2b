import { Context } from '@frontastic/extension-types';
import { ClientConfig } from '../interfaces/ClientConfig';
import { getFromProjectConfig } from './Context';

export const getConfig = (context: Context, engine: string): ClientConfig => {
  const prefix = `EXTENSION_${engine.toUpperCase()}`;

  const clientConfig: ClientConfig = {
    authUrl: getFromProjectConfig(`${prefix}_AUTH_URL`, context),
    clientId: getFromProjectConfig(`${prefix}_CLIENT_ID`, context),
    clientSecret: getFromProjectConfig(`${prefix}_CLIENT_SECRET`, context),
    hostUrl: getFromProjectConfig(`${prefix}_HOST_URL`, context),
    projectKey: getFromProjectConfig(`${prefix}_PROJECT_KEY`, context),
    productIdField: getFromProjectConfig(`${prefix}_PRODUCT_ID_FIELD`, context),
    categoryIdField: getFromProjectConfig(`${prefix}_CATEGORY_ID_FIELD`, context),
    defaultAssociateRoleKey: getFromProjectConfig(`${prefix}_DEFAULT_ASSOCIATE_ROLE_KEY`, context),
    defaultStoreKey: getFromProjectConfig(`${prefix}_DEFAULT_STORE_KEY`, context),
  };

  if (!clientConfig.authUrl) {
    clientConfig.authUrl = context.project.configuration?.[engine]?.authUrl;
  }

  if (!clientConfig.clientId) {
    clientConfig.clientId = context.project.configuration?.[engine]?.clientId;
  }

  if (!clientConfig.clientSecret) {
    clientConfig.clientSecret = context.project.configuration?.[engine]?.clientSecret;
  }

  if (!clientConfig.hostUrl) {
    clientConfig.hostUrl = context.project.configuration?.[engine]?.hostUrl;
  }

  if (!clientConfig.projectKey) {
    clientConfig.projectKey = context.project.configuration?.[engine]?.projectKey;
  }

  if (!clientConfig.productIdField) {
    clientConfig.productIdField = context.project.configuration?.[engine]?.productIdField;
  }

  if (!clientConfig.defaultAssociateRoleKey) {
    clientConfig.defaultAssociateRoleKey = context.project.configuration?.[engine]?.defaultAssociateRoleKey;
  }

  if (!clientConfig.defaultStoreKey) {
    clientConfig.defaultStoreKey = context.project.configuration?.[engine]?.defaultStoreKey;
  }

  return clientConfig;
};
