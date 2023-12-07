import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Table from '@/components/atoms/table';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import { PurchaseListsPageProps } from './types';
import SearchPanel from '../../components/search-panel';
import { DashboardLinks } from '../../constants';

const PurchaseListsPage = ({ purchaseLists }: PurchaseListsPageProps) => {
  const { translate } = useTranslation();

  return (
    <SearchPanel
      translations={{ button: translate('dashboard.purchase.list.add') }}
      buttonLink={`?subPath=add-purchase-list`}
      isEmpty={!purchaseLists.length}
      entity={translate('common.purchase.lists')}
    >
      <Table>
        <Table.Container>
          <Table.Head>
            <Table.Row>
              <Table.Cell>{translate('common.list.name')}</Table.Cell>
              <Table.Cell>{translate('common.store')}</Table.Cell>
              <Table.Cell>{translate('common.description')}</Table.Cell>
              <Table.Cell>{translate('common.items')}</Table.Cell>
              <Table.Cell isButtonsHead />
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {purchaseLists.map(({ id, name, store, description, items }) => (
              <Table.Row key={id}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{store}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
                <Table.Cell>{items.length > 0 ? items.length : '-'}</Table.Cell>
                <Table.Cell isButtonsCell>
                  <Link href={DashboardLinks.shoppingListDetail(id)} underlineOnHover={false}>
                    <Button variant="secondary">{translate('common.view')}</Button>
                  </Link>
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
