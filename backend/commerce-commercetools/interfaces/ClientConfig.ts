// Add more as required for versatility of Api

export interface ClientConfig {
  authUrl: string;
  clientId: string;
  clientSecret: string;
  hostUrl: string;
  projectKey: string;
  productIdField?: string;
  categoryIdField?: string;
  associateRoleAdminKey?: string;
  associateRoleBuyerKey?: string;
  defaultStoreKey: string;
}
