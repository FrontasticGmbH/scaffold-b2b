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
  page = 0,
  onPageChange,
  onRowsPerPageChange,
  limit = 25,
}: Partial<OrdersPageProps>) => {
  const { translate } = useTranslation();

  const { formatCurrency } = useFormat();

  return (
    <div>
      <Table className="mt-8 rounded-md ">
        <Table.Container className="table-fixed">
          <Table.Head className="border-b text-12 font-bold">
            <Table.Cell>{translate('common.status')}</Table.Cell>
            <Table.Cell>{translate('common.id')}</Table.Cell>
            <Table.Cell className="hidden md:table-cell">{translate('common.date')}</Table.Cell>
            <Table.Cell className="hidden lg:table-cell">{translate('common.business.unit')}</Table.Cell>
            <Table.Cell className="hidden md:table-cell">{translate('common.total')}</Table.Cell>
            <Table.Cell />
          </Table.Head>
          <Table.Body>
            {(orders ?? []).map(({ id, status, creationDate, businessUnit, total, currency }) => (
              <Table.Row key={id}>
                <Table.Cell>
                  <div className="flex items-center justify-between gap-2">
                    <OrderStatusTag status={status} />
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="block max-w-full truncate">{id}</span>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">{creationDate}</Table.Cell>
                <Table.Cell className="hidden lg:table-cell">{businessUnit}</Table.Cell>
                <Table.Cell className="hidden md:table-cell">{formatCurrency(total, currency)}</Table.Cell>
                <Table.Cell>
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
      </Table>
      <Table.Pagination
        page={page}
        limit={limit}
        totalItems={totalItems}
        onNext={() => onPageChange?.(page + 1)}
        onPrevious={() => onPageChange?.(page - 1)}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </div>
  );
};

export default OrdersTable;
