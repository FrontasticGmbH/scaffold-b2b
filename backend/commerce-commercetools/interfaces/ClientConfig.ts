// Add more as required for versatility of Api

export interface ClientConfig {
  authUrl: string;
  clientId: string;
  clientSecret: string;
  hostUrl: string;
  projectKey: string;
  productIdField?: string;
  storeRefField?: string;
  categoryIdField?: string;
  defaultAssociateRoleKeys?: string[];
  defaultStoreKey?: string;
  sessionUrl: string;
  checkoutApplicationKey: string;
}
