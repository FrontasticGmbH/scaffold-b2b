import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Table from '@/components/organisms/table';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import { PurchaseListsPageProps } from './types';
import SearchPanel from '../../components/search-panel';
import { DashboardLinks } from '../../constants';
import Accordion from '@/components/molecules/accordion';

const PurchaseListsPage = ({ purchaseLists, loading }: PurchaseListsPageProps) => {
  const { translate } = useTranslation();

  return (
    <SearchPanel
      translations={{ button: translate('dashboard.purchase.list.add') }}
      buttonLink={`?subPath=add-purchase-list`}
      isEmpty={!purchaseLists?.length}
      isLoading={loading}
      entity={translate('common.purchase.lists')}
    >
      <Table>
        <Table.Container className="hidden md:table">
          <Table.Head>
            <Table.Row>
              <Table.Cell isHeadCell>{translate('common.list.name')}</Table.Cell>
              <Table.Cell isHeadCell>{translate('common.store')}</Table.Cell>
              <Table.Cell isHeadCell>{translate('common.description')}</Table.Cell>
              <Table.Cell isHeadCell className="text-right">
                {translate('common.items')}
              </Table.Cell>
              <Table.Cell isButtonsHead />
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {purchaseLists?.map(({ id, name, store, description, items }) => (
              <Table.Row key={id}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{store?.name ?? '-'}</Table.Cell>
                <Table.Cell>
                  <p className="w-48 truncate lg:w-80"> {description}</p>
                </Table.Cell>
                <Table.Cell>
                  <p className="text-right">{items.length}</p>
                </Table.Cell>
                <Table.Cell isButtonsCell>
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

        <Table.Container className="table md:hidden">
          <Table.Head>
            <Table.Row>
              <Table.Cell isHeadCell>{translate('common.list.name')}</Table.Cell>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {purchaseLists?.map(({ id, name, store, description, items }) => (
              <Table.Row key={id}>
                <Table.Cell>
                  <Accordion className="border-none text-gray-600">
                    <Accordion.Button defaultSpacing={false}>
                      <p className="font-semibold">{name}</p>
                      <div className="mt-2 flex">
                        <p className="basis-28 font-semibold">{translate('common.items')}: </p>
                        <p className="text-gray-500">{items.length}</p>
                      </div>
                    </Accordion.Button>

                    <Accordion.Panel defaultSpacing={false}>
                      <div className="flex">
                        <p className="basis-28 font-semibold">{translate('common.store')}: </p>
                        <p className="text-gray-500"> {store?.name ?? '-'}</p>
                      </div>

                      {description && (
                        <div className="mt-3 flex flex-col">
                          <p className="font-semibold">{translate('common.description')}: </p>
                          <p className="max-w-sm text-wrap text-gray-500"> {description}</p>
                        </div>
                      )}

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
      </Table>
    </SearchPanel>
  );
};

export default PurchaseListsPage;
