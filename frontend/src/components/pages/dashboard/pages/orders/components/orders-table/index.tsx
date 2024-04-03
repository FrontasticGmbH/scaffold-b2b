import React from 'react';
import Table from '@/components/atoms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import useFormat from '@/hooks/useFormat';
import OrderStatusTag from '@/components/pages/dashboard/components/order-status-tag';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import { OrdersPageProps } from '../../types';

const OrdersTable = ({
  orders,
  totalItems = 0,
  page = 1,
  onPageChange,
  onRowsPerPageChange,
  limit = 25,
}: Partial<OrdersPageProps>) => {
  const { translate } = useTranslation();

  const { formatCurrency } = useFormat();

  return (
    <Table className="mt-8">
      <Table.Container className="table-fixed rounded-md">
        <Table.Head className="border-b text-12 font-bold">
          <Table.Cell>{translate('common.status')}</Table.Cell>
          <Table.Cell>{translate('common.id')}</Table.Cell>
          <Table.Cell>{translate('common.date')}</Table.Cell>
          <Table.Cell>{translate('common.business.unit')}</Table.Cell>
          <Table.Cell className="text-right">{translate('common.total')}</Table.Cell>
          <Table.Cell isButtonsHead />
        </Table.Head>
        <Table.Body>
          {(orders ?? []).map(({ id, number, status, creationDate, businessUnit, total, currency }) => (
            <Table.Row key={id}>
              <Table.Cell>
                <div className="flex items-center justify-between gap-2">
                  <OrderStatusTag status={status} />
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="block max-w-full truncate">{number}</span>
              </Table.Cell>
              <Table.Cell>{new Date(creationDate).toLocaleDateString()}</Table.Cell>
              <Table.Cell>{businessUnit}</Table.Cell>
              <Table.Cell className="text-right">{formatCurrency(total, currency)}</Table.Cell>
              <Table.Cell isButtonsCell>
                <div className="flex justify-end">
                  <Link href={DashboardLinks.orderDetail(id)} underlineOnHover={false}>
                    <Button variant="secondary">{translate('common.view')}</Button>
                  </Link>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>

      <Table.Pagination
        page={page}
        limit={limit}
        totalItems={totalItems}
        onNext={() => onPageChange?.(page + 1)}
        onPrevious={() => onPageChange?.(page - 1)}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Table>
  );
};

export default OrdersTable;
