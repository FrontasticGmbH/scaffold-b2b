import { Account } from '../account';

export type Permission =
  | 'AcceptMyQuotes'
  | 'AcceptOthersQuotes'
  | 'AddChildUnits'
  | 'CreateApprovalRules'
  | 'CreateMyCarts'
  | 'CreateMyOrdersFromMyCarts'
  | 'CreateMyOrdersFromMyQuotes'
  | 'CreateMyQuoteRequestsFromMyCarts'
  | 'CreateOrdersFromOthersCarts'
  | 'CreateOrdersFromOthersQuotes'
  | 'CreateOthersCarts'
  | 'CreateQuoteRequestsFromOthersCarts'
  | 'DeclineMyQuotes'
  | 'DeclineOthersQuotes'
  | 'DeleteMyCarts'
  | 'DeleteOthersCarts'
  | 'ReassignMyQuotes'
  | 'ReassignOthersQuotes'
  | 'RenegotiateMyQuotes'
  | 'RenegotiateOthersQuotes'
  | 'UpdateApprovalFlows'
  | 'UpdateApprovalRules'
  | 'UpdateAssociates'
  | 'UpdateBusinessUnitDetails'
  | 'UpdateMyCarts'
  | 'UpdateMyOrders'
  | 'UpdateMyQuoteRequests'
  | 'UpdateOthersCarts'
  | 'UpdateOthersOrders'
  | 'UpdateOthersQuoteRequests'
  | 'UpdateParentUnit'
  | 'ViewMyCarts'
  | 'ViewMyOrders'
  | 'ViewMyQuoteRequests'
  | 'ViewMyQuotes'
  | 'ViewOthersCarts'
  | 'ViewOthersOrders'
  | 'ViewOthersQuoteRequests'
  | 'ViewOthersQuotes'
  | 'ViewMyShoppingLists'
  | 'ViewOthersShoppingLists'
  | 'CreateMyShoppingLists'
  | 'CreateOthersShoppingLists'
  | 'DeleteMyShoppingLists'
  | 'DeleteOthersShoppingLists'
  | 'UpdateMyShoppingLists'
  | 'UpdateOthersShoppingLists'

export interface AssociateRole {
  key?: string;
  name?: string;
  permissions?: Permission[];
}

export interface Associate extends Account {
  roles?: AssociateRole[];
}
