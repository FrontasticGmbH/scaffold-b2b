import React from 'react';
import { useTranslations } from 'use-intl';
import Table from '@/components/organisms/table';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import Accordion from '@/components/molecules/accordion';
import Select from '@/components/atoms/select';
import useHeaderData from '@/lib/tastics/header/hooks/useHeaderData';
import LoadingIcon from '@/components/atoms/loading-icon';
import { classnames } from '@/utils/classnames/classnames';
import Image from '@/components/atoms/Image';
import { Tooltip } from 'react-tooltip';
import { PurchaseListItem } from '@/types/entity/purchase-list';
import { DashboardLinks } from '../../constants';
import { PurchaseListsPageProps } from './types';

const PurchaseListsPage = ({ purchaseLists, loading, image, permissionImage, permissions }: PurchaseListsPageProps) => {
  const translate = useTranslations();
  const { businessUnits, onBusinessUnitSelect, selectedBusinessUnit } = useHeaderData();

  const canViewLists = permissions?.ViewMyShoppingLists || permissions?.ViewOthersShoppingLists;
  const canCreateShoppingList = permissions?.CreateMyShoppingLists || permissions?.CreateOthersShoppingLists;

  const businessUnitMap = businessUnits?.reduce(
    (acc, { name, value }) => {
      acc[value] = name;
      return acc;
    },
    {} as Record<string, string>,
  );

  if (permissions && !canViewLists) {
    return (
      <div className="flex flex-col-reverse items-center justify-center gap-6 rounded border border-gray-300 p-6 lg:flex-row lg:p-20">
        <div className="mb-6 flex w-full flex-col gap-2 text-center md:max-w-72 lg:mb-0 lg:text-left">
          <p className="text-xl font-bold text-gray-700">{translate('common.permission-required')}</p>
          <p className="text-gray-600">{translate('dashboard.purchase-list-create-denied-extended')}</p>
        </div>
        <Image className="size-48" src={permissionImage?.media?.file} alt={permissionImage?.media?.alt ?? ''} />
      </div>
    );
  }

  const getItemsCount = (listItems: PurchaseListItem[]) => {
    const count = listItems.reduce((acc, curr) => {
      return acc + curr.quantity;
    }, 0);

    return count;
  };

  return (
    <>
      <div className="mb-4 flex flex-col-reverse gap-4 md:flex-row md:items-end md:justify-between">
        <Select
          label={translate('common.business-unit')}
          enableSearch
          options={businessUnits}
          value={selectedBusinessUnit}
          onChange={onBusinessUnitSelect}
        />
        <Link
          href={!canCreateShoppingList ? '' : `?subPath=add-purchase-list`}
          className="block w-full md:w-fit"
          underlineOnHover={false}
        >
          {!canCreateShoppingList && (
            <Tooltip
              id="shopping-list-create-button"
              content={translate('dashboard.purchase-list-create-denied')}
              place="left"
              style={{ width: '15rem' }}
            />
          )}

          <span data-tooltip-id="shopping-list-create-button">
            <Button size="m" className="w-full px-6" disabled={!canCreateShoppingList}>
              {translate('dashboard.purchase-list-add')}
            </Button>
          </span>
        </Link>
      </div>

      <Table>
        <Table.Container
          className={classnames('hidden lg:table', { 'rounded-b-none border-b-0': !purchaseLists?.length })}
        >
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>{translate('common.list-name')}</Table.HeaderCell>
              <Table.HeaderCell>{translate('common.store')}</Table.HeaderCell>
              <Table.HeaderCell>{translate('common.description')}</Table.HeaderCell>
              <Table.HeaderCell>{translate('common.business-unit')}</Table.HeaderCell>
              <Table.HeaderCell className="text-right">{translate('common.items')}</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Head>

          <Table.Body className="whitespace-pre text-sm">
            {purchaseLists?.map(({ id, name, store, description, items, businessUnitKey }) => (
              <Table.Row key={id}>
                <Table.Cell>
                  <p className="max-w-1/5 text-wrap">{name}</p>
                </Table.Cell>
                <Table.Cell>
                  <p className="max-w-1/4 text-wrap">{store?.name ?? '-'} </p>
                </Table.Cell>
                <Table.Cell>
                  <p className="max-w-1/3 text-wrap text-sm">{description}</p>
                </Table.Cell>
                <Table.Cell>
                  <p className="max-w-1/4 text-wrap">{businessUnitMap[businessUnitKey ?? '']}</p>
                </Table.Cell>
                <Table.Cell>
                  <p className="text-right">{getItemsCount(items)}</p>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex justify-end">
                    <Link href={DashboardLinks.shoppingListDetail(id)} underlineOnHover={false}>
                      <Button variant="secondary">{translate('common.view')}</Button>
                    </Link>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Container>

        <Table.Container
          className={classnames('table lg:hidden', { 'rounded-b-none border-b-0': !purchaseLists?.length })}
        >
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>{translate('common.list-name')}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {purchaseLists?.map(({ id, name, store, description, items, businessUnitKey }) => (
              <Table.Row key={id}>
                <Table.Cell>
                  <Accordion className="border-none text-gray-600">
                    <Accordion.Button defaultSpacing={false}>
                      <p className="w-full text-wrap font-semibold">{name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <p className="uppercase">{translate('common.store')}: </p>
                        <p className="w-2/3 truncate"> {store?.name ?? '-'}</p>
                      </div>
                    </Accordion.Button>

                    <Accordion.Panel defaultSpacing={false}>
                      {description && (
                        <div className="mt-4 flex gap-1 text-sm">
                          <p className="basis-28 font-semibold uppercase">{translate('common.description')}: </p>
                          <p className="w-2/3 text-wrap text-gray-500 md:w-5/6"> {description}</p>
                        </div>
                      )}

                      <div className="mt-2 flex gap-1 text-sm">
                        <p className="basis-28 font-semibold uppercase">{translate('common.business-unit')}: </p>
                        <p className="w-2/3 text-wrap text-gray-500 md:w-5/6">
                          {businessUnitMap[businessUnitKey ?? '']}
                        </p>
                      </div>

                      <div className="mt-2 flex gap-1 text-sm">
                        <p className="basis-28 font-semibold uppercase">{translate('common.items')}: </p>
                        <p className="w-2/3 text-wrap text-gray-500 md:w-5/6">{getItemsCount(items)}</p>
                      </div>

                      <div className="mt-4">
                        <Link href={DashboardLinks.shoppingListDetail(id)} underlineOnHover={false}>
                          <Button variant="secondary">{translate('common.view')}</Button>
                        </Link>
                      </div>
                    </Accordion.Panel>
                  </Accordion>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Container>
        {!purchaseLists?.length && (
          <div className="flex flex-col items-center justify-center gap-3 rounded rounded-t-none border border-t-0 border-gray-300 p-16">
            {purchaseLists?.length === 0 && (
              <>
                <Image className="size-32" src={image?.media?.file} alt={image?.media?.alt ?? ''} />

                <p className="text-14 text-gray-600">
                  {translate('dashboard.no-entity-added', { entity: translate('common.purchase-list') })}
                </p>
              </>
            )}

            {loading && (
              <span className="flex w-full justify-center py-8">
                <LoadingIcon svgWidth={20} svgHeight={20} className="fill-gray-700" />
              </span>
            )}
          </div>
        )}
      </Table>
    </>
  );
};

export default PurchaseListsPage;
