export const DashboardLinks = {
  dashboard: '/dashboard',
  companyAdmin: '/company-admin',
  shoppingLists: '/purchase-lists',
  addresses: '/addresses',
  quotes: '/quotes',
  orders: '/orders',
  settings: '/settings',
  shoppingListDetail: (id: string) => `/purchase-list/${id.replace(/\s+/g, '-')}`,
  quoteDetail: (id: string) => `/quote/${id.replace(/\s+/g, '-')}`,
  quoteRequestDetail: (id: string) => `/quote-request/${id.replace(/\s+/g, '-')}`,
  orderDetail: (id: string) => `/order/${id.replace(/\s+/g, '-')}`,
};
