import { BusinessUnit, BusinessUnitStatus, BusinessUnitType, StoreMode } from '@Types/business-unit/BusinessUnit';
import {
  ApprovalFlowApproveAction,
  ApprovalFlowUpdateAction,
  ApprovalRuleUpdateAction,
  AssociateRoleAssignmentDraft,
  BusinessUnitDraft,
  BusinessUnitUpdateAction,
} from '@commercetools/platform-sdk';
import { Store } from '@Types/store/Store';
import { Associate } from '@Types/business-unit/Associate';
import { Account } from '@Types/account/Account';
import { AssociateRole } from '@Types/business-unit/Associate';
import { Address } from '@Types/account';
import { ApprovalFlow, ApprovalFlowsQuery, ApprovalRule } from '@Types/business-unit';
import { PaginatedResult } from '@Types/result';
import { ApprovalRuleQuery } from '@Types/business-unit/ApprovalRule';
import { ApprovalFlowRejectAction } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/approval-flow';
import BusinessUnitMapper from '../mappers/BusinessUnitMapper';
import { ExternalError } from '@Commerce-commercetools/errors/ExternalError';
import { businessUnitKeyFormatter } from '@Commerce-commercetools/utils/BussinessUnitFormatter';
import BaseApi from '@Commerce-commercetools/apis/BaseApi';
import { ResourceNotFoundError } from '@Commerce-commercetools/errors/ResourceNotFoundError';
import AccountMapper from '@Commerce-commercetools/mappers/AccountMapper';
import Guid from '@Commerce-commercetools/utils/Guid';
import getStoreApi from '@Commerce-commercetools/utils/apiConstructors/getStoreApi';
import ProductMapper from '@Commerce-commercetools/mappers/ProductMapper';
import { getOffsetFromCursor } from '@Commerce-commercetools/utils/Pagination';

const MAX_LIMIT = 50;

export default class BusinessUnitApi extends BaseApi {
  async createForAccount(account: Account): Promise<BusinessUnit> {
    const businessUnitKey = businessUnitKeyFormatter(account.companyName);

    const associateRoleAssignments = this.defaultAssociateRoleKeys.map((associateRoleKey) => {
      const associateRoleAssignment: AssociateRoleAssignmentDraft = {
        associateRole: {
          typeId: 'associate-role',
          key: associateRoleKey,
        },
        inheritance: `Enabled`,
      };

      return associateRoleAssignment;
    });

    const businessUnitDraft: BusinessUnitDraft = {
      key: businessUnitKey,
      name: account.companyName,
      status: BusinessUnitStatus.Active,
      stores: [{ key: this.clientSettings.defaultStoreKey, typeId: 'store' }],
      storeMode: StoreMode.Explicit,
      unitType: BusinessUnitType.Company,
      contactEmail: account.email,
      associates: [
        {
          associateRoleAssignments,
          customer: {
            id: account.accountId,
            typeId: 'customer',
          },
        },
      ],
    };

    return this.associateRequestBuilder(account.accountId)
      .businessUnits()
      .post({
        body: businessUnitDraft,
      })
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async update(businessUnitKey: string, accountId: string, actions: BusinessUnitUpdateAction[]): Promise<BusinessUnit> {
    return this.getByKey(businessUnitKey).then((businessUnit) =>
      this.associateRequestBuilder(accountId)
        .businessUnits()
        .withKey({ key: businessUnitKey })
        .post({
          body: {
            version: businessUnit.version,
            actions,
          },
        })
        .execute()
        .then((response) => {
          return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body);
        })
        .catch((error) => {
          throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
        }),
    );
  }

  async getByKey(businessUnitKey: string): Promise<BusinessUnit> {
    return this.requestBuilder()
      .businessUnits()
      .withKey({ key: businessUnitKey })
      .get()
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getByKeyForAccount(businessUnitKey: string, accountId: string, expandStores?: boolean): Promise<BusinessUnit> {
    const expand = ['associates[*].customer', 'inheritedAssociates[*].customer'];

    const businessUnit = await this.associateRequestBuilder(accountId)
      .businessUnits()
      .withKey({ key: businessUnitKey })
      .get({
        queryArgs: {
          expand,
          limit: MAX_LIMIT,
        },
      })
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(response.body);
      })
      .catch((error) => {
        if (error.code === 404) {
          throw new ResourceNotFoundError({ message: `Business unit "${businessUnitKey}" not found for this account` });
        }

        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (expandStores) {
      // The SDK doesn't return inherited stores, so we need to fetch them manually
      if (businessUnit.storeMode === StoreMode.FromParent) {
        businessUnit.stores = await this.getBusinessUnitStoresFromParentUnitKey(businessUnit.parentUnit.key);
      }

      const storeApi = getStoreApi(this.commercetoolsFrontendContext, this.locale, this.currency);
      const storeKeys = businessUnit?.stores?.map((store) => `"${store.key}"`).join(' ,');

      const allStores = storeKeys ? await storeApi.query(`key in (${storeKeys})`) : [];

      businessUnit.stores = BusinessUnitMapper.expandStores(businessUnit.stores, allStores);
    }

    return businessUnit;
  }

  async getBusinessUnitsForUser(accountId: string, expandStores?: boolean): Promise<BusinessUnit[]> {
    const expand = ['associates[*].customer', 'inheritedAssociates[*].customer'];

    const businessUnits = await this.associateRequestBuilder(accountId)
      .businessUnits()
      .get({
        queryArgs: {
          expand,
          limit: MAX_LIMIT,
        },
      })
      .execute()
      .then((response) => {
        return response.body.results.map((commercetoolsBusinessUnit) => {
          return BusinessUnitMapper.commercetoolsBusinessUnitToBusinessUnit(commercetoolsBusinessUnit);
        });
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });

    if (expandStores) {
      // The SDK doesn't return inherited stores, so we need to fetch them manually
      for (const businessUnit of businessUnits) {
        if (businessUnit.storeMode === StoreMode.FromParent) {
          businessUnit.stores = await this.getBusinessUnitStoresFromParentUnitKey(businessUnit.parentUnit.key);
        }
      }

      const storeApi = getStoreApi(this.commercetoolsFrontendContext, this.locale, this.currency);

      const storeKeys = businessUnits
        .reduce((prev: Store[], curr) => {
          prev = prev.concat(curr.stores || []);
          return prev;
        }, [])
        ?.map((store) => `"${store.key}"`)
        .join(' ,');

      const allStores = storeKeys ? await storeApi.query(`key in (${storeKeys})`) : [];

      businessUnits.map((businessUnit) => {
        businessUnit.stores = BusinessUnitMapper.expandStores(businessUnit.stores, allStores);
      });
    }

    return businessUnits;
  }

  async getAssociateRoles(): Promise<AssociateRole[]> {
    // Get associate roles refreshing the cache to ensure we have the latest data
    return this.getCommercetoolsAssociatesRoles(true)
      .then((associateRoles) => {
        return associateRoles
          .filter((associateRole) => associateRole.buyerAssignable)
          .map((associateRole) => BusinessUnitMapper.commercetoolsAssociateRoleToAssociateRole(associateRole));
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async updateBusinessUnit(requestData: BusinessUnit, accountId: string): Promise<BusinessUnit> {
    let businessUnit = requestData;
    const updateActions: Array<BusinessUnitUpdateAction> = [];

    if (requestData.name) {
      updateActions.push({
        action: 'changeName',
        name: requestData.name,
      });
    }
    if (requestData.contactEmail) {
      updateActions.push({
        action: 'setContactEmail',
        contactEmail: requestData.contactEmail,
      });
    }
    if (updateActions.length > 0) {
      businessUnit = await this.update(requestData.key, accountId, updateActions);
    }

    return businessUnit;
  }

  async updateBusinessUnitAddress(businessUnitKey: string, accountId: string, address: Address) {
    let commercetoolsAddress = AccountMapper.addressToCommercetoolsAddress(address);

    const businessUnitUpdateAction: BusinessUnitUpdateAction[] = [];

    if (
      commercetoolsAddress.key === undefined &&
      (address.isDefaultBillingAddress || address.isDefaultShippingAddress)
    ) {
      commercetoolsAddress = {
        ...commercetoolsAddress,
        key: Guid.newGuid(),
      };
    }

    businessUnitUpdateAction.push({
      action: 'changeAddress',
      addressId: commercetoolsAddress.id,
      address: commercetoolsAddress,
    });

    const addressIdentifiers = commercetoolsAddress.key
      ? { addressKey: commercetoolsAddress.key }
      : { addressId: commercetoolsAddress.id };

    if (address.isDefaultBillingAddress) {
      businessUnitUpdateAction.push({ action: 'setDefaultBillingAddress', ...addressIdentifiers });
    }

    if (address.isDefaultShippingAddress) {
      businessUnitUpdateAction.push({ action: 'setDefaultShippingAddress', ...addressIdentifiers });
    }

    return await this.update(businessUnitKey, accountId, businessUnitUpdateAction);
  }

  async addBusinessUnitAddress(businessUnitKey: string, accountId: string, address: Address) {
    let commercetoolsAddress = AccountMapper.addressToCommercetoolsAddress(address);

    const businessUnitUpdateAction: BusinessUnitUpdateAction[] = [];

    // For new address, remove the id as CoCo will set it
    if (commercetoolsAddress.id !== undefined) {
      commercetoolsAddress = {
        ...commercetoolsAddress,
        id: undefined,
      };
    }

    if (commercetoolsAddress.key === undefined) {
      commercetoolsAddress = {
        ...commercetoolsAddress,
        key: Guid.newGuid(),
      };
    }

    businessUnitUpdateAction.push({ action: 'addAddress', address: commercetoolsAddress });

    if (address.isDefaultBillingAddress) {
      businessUnitUpdateAction.push({ action: 'setDefaultBillingAddress', addressKey: commercetoolsAddress.key });
    }

    if (address.isDefaultShippingAddress) {
      businessUnitUpdateAction.push({ action: 'setDefaultShippingAddress', addressKey: commercetoolsAddress.key });
    }

    return await this.update(businessUnitKey, accountId, businessUnitUpdateAction);
  }

  async removeBusinessUnitAddress(businessUnitKey: string, accountId: string, addressId: string) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'removeAddress',
        addressId,
      },
    ]);
  }

  async getAssociate(businessUnitKey: string, account: Account): Promise<Associate> {
    return this.requestBuilder()
      .businessUnits()
      .keyWithKeyValueAssociatesWithAssociateIdValue({ key: businessUnitKey, associateId: account?.accountId })
      .get()
      .execute()
      .then((response) => {
        const roles = response.body.associateRoles.map((associate) => ({
          key: associate.key,
          permissions: BusinessUnitMapper.commercetoolsPermissionsToPermissions(associate.permissions),
        }));
        return {
          ...account,
          roles,
        };
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async updateAssociate(businessUnitKey: string, accountId: string, associateId: string, associateRoleKeys: string[]) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'changeAssociate',
        associate: {
          customer: {
            typeId: 'customer',
            id: associateId,
          },
          associateRoleAssignments: associateRoleKeys.map((roleKey) => ({
            associateRole: {
              typeId: 'associate-role',
              key: roleKey,
            },
          })),
        },
      },
    ]);
  }

  async removeAssociate(businessUnitKey: string, accountId: string, associateAccountId: string) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'removeAssociate',
        customer: {
          typeId: 'customer',
          id: associateAccountId,
        },
      },
    ]);
  }

  async addAssociate(businessUnitKey: string, accountId: string, associateId: string, associateRoleKeys: string[]) {
    return await this.update(businessUnitKey, accountId, [
      {
        action: 'addAssociate',
        associate: {
          customer: {
            typeId: 'customer',
            id: associateId,
          },
          associateRoleAssignments: associateRoleKeys.map((roleKey) => ({
            associateRole: {
              typeId: 'associate-role',
              key: roleKey,
            },
          })),
        },
      },
    ]);
  }

  protected async getBusinessUnitStoresFromParentUnitKey(parentUnitKey: string): Promise<Store[]> {
    const businessUnit = await this.getByKey(parentUnitKey);

    if (businessUnit.storeMode === StoreMode.Explicit) {
      return businessUnit.stores;
    }

    return this.getBusinessUnitStoresFromParentUnitKey(businessUnit.parentUnit.key);
  }

  async createApprovalRule(
    accountId: string,
    businessUnitKey: string,
    approvalRule: ApprovalRule,
  ): Promise<ApprovalRule> {
    const approvalRuleDraft = BusinessUnitMapper.approvalRuleToCommercetoolsApprovalRuleDraft(approvalRule);

    return this.associateRequestBuilder(accountId)
      .inBusinessUnitKeyWithBusinessUnitKeyValue({
        businessUnitKey: businessUnitKey,
      })
      .approvalRules()
      .post({
        body: approvalRuleDraft,
      })
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsApprovalRuleToApprovalRule(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async queryApprovalRules(
    businessUnitKey: string,
    accountId: string,
    approvalRuleQuery: ApprovalRuleQuery,
  ): Promise<PaginatedResult<ApprovalRule>> {
    const limit = +approvalRuleQuery.limit || undefined;
    const sortAttributes: string[] = [];

    if (approvalRuleQuery.sortAttributes !== undefined) {
      Object.keys(approvalRuleQuery.sortAttributes).map((field, directionIndex) => {
        sortAttributes.push(`${field} ${Object.values(approvalRuleQuery.sortAttributes)[directionIndex]}`);
      });
    } else {
      // default sort
      sortAttributes.push(`lastModifiedAt desc`);
    }

    const whereClause = [];

    if (approvalRuleQuery.approvalRuleIds !== undefined && approvalRuleQuery.approvalRuleIds.length !== 0) {
      whereClause.push(`id in ("${approvalRuleQuery.approvalRuleIds.join('","')}")`);
    }

    if (approvalRuleQuery.approvalRuleStatus !== undefined && approvalRuleQuery.approvalRuleStatus.length > 0) {
      whereClause.push(`status in ("${approvalRuleQuery.approvalRuleStatus.join('","')}")`);
    }

    return this.associateRequestBuilder(accountId)
      .inBusinessUnitKeyWithBusinessUnitKeyValue({ businessUnitKey })
      .approvalRules()
      .get({
        queryArgs: {
          where: whereClause,
          limit: limit,
          offset: getOffsetFromCursor(approvalRuleQuery.cursor),
          sort: sortAttributes,
        },
      })
      .execute()
      .then((response) => {
        const approvalRules = response.body.results.map((approvalRule) =>
          BusinessUnitMapper.commercetoolsApprovalRuleToApprovalRule(approvalRule),
        );

        const result: PaginatedResult<ApprovalRule> = {
          total: response.body.total,
          items: approvalRules,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
        };
        return result;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getApprovalRuleById(accountId: string, businessUnitKey: string, approvalRuleId: string): Promise<ApprovalRule> {
    return this.associateRequestBuilder(accountId)
      .inBusinessUnitKeyWithBusinessUnitKeyValue({ businessUnitKey })
      .approvalRules()
      .withId({ ID: approvalRuleId })
      .get()
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsApprovalRuleToApprovalRule(response.body);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async updateApprovalRule(
    approvalRuleRequest: ApprovalRule,
    accountId: string,
    businessUnitKey: string,
  ): Promise<ApprovalRule> {
    const updateActions: Array<ApprovalRuleUpdateAction> = [];

    if (approvalRuleRequest.name) {
      updateActions.push({
        action: 'setName',
        name: approvalRuleRequest.name,
      });
    }

    if (approvalRuleRequest.approvalRuleStatus) {
      updateActions.push({
        action: 'setStatus',
        status: approvalRuleRequest.approvalRuleStatus,
      });
    }

    if (approvalRuleRequest.description) {
      updateActions.push({
        action: 'setDescription',
        description: approvalRuleRequest.description,
      });
    }

    if (approvalRuleRequest.key) {
      updateActions.push({
        action: 'setKey',
        key: approvalRuleRequest.key,
      });
    }

    if (approvalRuleRequest.predicate) {
      updateActions.push({
        action: 'setPredicate',
        predicate: approvalRuleRequest.predicate,
      });
    }

    if (approvalRuleRequest.approvers) {
      updateActions.push({
        action: 'setApprovers',
        approvers: BusinessUnitMapper.approvalRuleApproverToCommercetoolsApprovalRuleApprover(
          approvalRuleRequest.approvers,
        ),
      });
    }

    if (approvalRuleRequest.requesters) {
      updateActions.push({
        action: 'setRequesters',
        requesters: BusinessUnitMapper.approvalRuleRequesterToCommercetoolsRuleRequester(
          approvalRuleRequest.requesters,
        ),
      });
    }

    if (updateActions.length === 0) {
      // There is nothing to be updated
      return approvalRuleRequest;
    }

    return this.getApprovalRuleById(accountId, businessUnitKey, approvalRuleRequest.approvalRuleId).then(
      (approvalRule) =>
        this.associateRequestBuilder(accountId)
          .inBusinessUnitKeyWithBusinessUnitKeyValue({ businessUnitKey })
          .approvalRules()
          .withId({ ID: approvalRule.approvalRuleId })
          .post({
            body: {
              version: approvalRule.approvalRuleVersion,
              actions: updateActions,
            },
          })
          .execute()
          .then((response) => {
            return BusinessUnitMapper.commercetoolsApprovalRuleToApprovalRule(response.body);
          })
          .catch((error) => {
            throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
          }),
    );
  }

  async queryApprovalFlows(
    businessUnitKey: string,
    accountId: string,
    approvalRuleQuery: ApprovalFlowsQuery,
  ): Promise<PaginatedResult<ApprovalFlow>> {
    const limit = +approvalRuleQuery.limit || undefined;
    const sortAttributes: string[] = [];
    const locale = await this.getCommercetoolsLocal();

    if (approvalRuleQuery.sortAttributes !== undefined) {
      Object.keys(approvalRuleQuery.sortAttributes).map((field, directionIndex) => {
        sortAttributes.push(`${field} ${Object.values(approvalRuleQuery.sortAttributes)[directionIndex]}`);
      });
    } else {
      // default sort
      sortAttributes.push(`lastModifiedAt desc`);
    }

    const whereClause = [];

    if (approvalRuleQuery.approvalFlowIds !== undefined && approvalRuleQuery.approvalFlowIds.length !== 0) {
      whereClause.push(`id in ("${approvalRuleQuery.approvalFlowIds.join('","')}")`);
    }

    if (approvalRuleQuery.approvalFlowStatus !== undefined && approvalRuleQuery.approvalFlowStatus.length > 0) {
      whereClause.push(`status in ("${approvalRuleQuery.approvalFlowStatus.join('","')}")`);
    }

    return this.associateRequestBuilder(accountId)
      .inBusinessUnitKeyWithBusinessUnitKeyValue({ businessUnitKey })
      .approvalFlows()
      .get({
        queryArgs: {
          where: whereClause,
          expand: ['order', 'approvals[*].approver.customer'],
          limit: limit,
          offset: getOffsetFromCursor(approvalRuleQuery.cursor),
          sort: sortAttributes,
        },
      })
      .execute()
      .then((response) => {
        const commercetoolsApprovalFlows = response.body.results.map((approvalFlow) =>
          BusinessUnitMapper.commercetoolsApprovalFlowToApprovalFlow(approvalFlow, locale, this.defaultLocale),
        );

        const result: PaginatedResult<ApprovalFlow> = {
          total: response.body.total,
          items: commercetoolsApprovalFlows,
          count: response.body.count,
          previousCursor: ProductMapper.calculatePreviousCursor(response.body.offset, response.body.count),
          nextCursor: ProductMapper.calculateNextCursor(response.body.offset, response.body.count, response.body.total),
        };

        return result;
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async getApprovalFlowById(accountId: string, businessUnitKey: string, approvalFlowId: string): Promise<ApprovalFlow> {
    const locale = await this.getCommercetoolsLocal();
    return this.associateRequestBuilder(accountId)
      .inBusinessUnitKeyWithBusinessUnitKeyValue({ businessUnitKey })
      .approvalFlows()
      .withId({ ID: approvalFlowId })
      .get({
        queryArgs: {
          expand: ['order', 'approvals[*].approver.customer'],
        },
      })
      .execute()
      .then((response) => {
        return BusinessUnitMapper.commercetoolsApprovalFlowToApprovalFlow(response.body, locale, this.defaultLocale);
      })
      .catch((error) => {
        throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
      });
  }

  async updateApprovalFlow(
    businessUnitKey: string,
    accountId: string,
    actions: ApprovalFlowUpdateAction[],
    approvalFlowId: string,
  ): Promise<ApprovalFlow> {
    const locale = await this.getCommercetoolsLocal();

    return this.getApprovalFlowById(accountId, businessUnitKey, approvalFlowId).then((approvalFlow) =>
      this.associateRequestBuilder(accountId)
        .inBusinessUnitKeyWithBusinessUnitKeyValue({ businessUnitKey })
        .approvalFlows()
        .withId({ ID: approvalFlow.approvalFlowId })
        .post({
          body: {
            version: approvalFlow.approvalFlowVersion,
            actions,
          },
          queryArgs: {
            expand: ['order', 'approvals[*].approver.customer'],
          },
        })
        .execute()
        .then((response) => {
          return BusinessUnitMapper.commercetoolsApprovalFlowToApprovalFlow(response.body, locale, this.defaultLocale);
        })
        .catch((error) => {
          throw new ExternalError({ statusCode: error.code, message: error.message, body: error.body });
        }),
    );
  }

  async approveApprovalFlow(businessUnitKey: string, accountId: string, approvalFlowId: string): Promise<ApprovalFlow> {
    const approveAction: ApprovalFlowApproveAction = {
      action: 'approve',
    };

    return this.updateApprovalFlow(businessUnitKey, accountId, [approveAction], approvalFlowId);
  }

  async rejectApprovalFlow(
    businessUnitKey: string,
    accountId: string,
    approvalFlowId: string,
    reason?: string,
  ): Promise<ApprovalFlow> {
    const rejectAction: ApprovalFlowRejectAction = {
      action: 'reject',
      reason: reason,
    };

    return this.updateApprovalFlow(businessUnitKey, accountId, [rejectAction], approvalFlowId);
  }
}
