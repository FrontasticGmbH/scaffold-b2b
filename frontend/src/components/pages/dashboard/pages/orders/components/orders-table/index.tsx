import React from 'react';
import Table from '@/components/organisms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import useFormat from '@/hooks/useFormat';
import OrderStatusTag from '@/components/pages/dashboard/components/order-status-tag';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import { TablePaginationProps } from '@/components/organisms/table/types';
import { Order } from '@/types/entity/order';
import Accordion from '@/components/molecules/accordion';

interface OrdersTableProps {
  orders: Order[];
  pagination?: TablePaginationProps;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, pagination }) => {
  const { translate } = useTranslation();

  const { formatCurrency } = useFormat();

  return (
    <Table>
      <Table.Container className="hidden table-fixed rounded-md md:table">
        <Table.Head className="border-b text-12 font-bold">
          <Table.Cell isHeadCell>{translate('common.status')}</Table.Cell>
          <Table.Cell isHeadCell>{translate('common.id')}</Table.Cell>
          <Table.Cell isHeadCell>{translate('common.date')}</Table.Cell>
          <Table.Cell isHeadCell>{translate('common.business.unit')}</Table.Cell>
          <Table.Cell isHeadCell className="text-right">
            {translate('common.total')}
          </Table.Cell>
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
              <Table.Cell>
                <p className="w-36 truncate lg:w-full">{businessUnit}</p>
              </Table.Cell>
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

      <Table.Container className="table rounded-md md:hidden">
        <Table.Head className="border-b text-12 font-bold">
          <Table.Row>
            <Table.Cell isHeadCell>{translate('common.id')}</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {(orders ?? []).map(({ id, number, status, creationDate, businessUnit, total, currency }) => (
            <Table.Row key={id}>
              <Table.Cell>
                <Accordion className="border-none text-gray-600">
                  <Accordion.Button defaultSpacing={false}>
                    <p className="font-semibold">{number}</p>
                    <p className="my-2 text-14 text-gray-500">{new Date(creationDate).toLocaleDateString()}</p>
                    <div className="">
                      <OrderStatusTag status={status} />
                    </div>
                  </Accordion.Button>
                  <Accordion.Panel defaultSpacing={false}>
                    <div className="mt-2 flex gap-2">
                      <p className="basis-32 font-semibold uppercase"> {translate('common.business.unit')}:</p>
                      <p className="w-48 truncate">{businessUnit}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="basis-32 font-semibold uppercase">{translate('common.total')}:</p>
                      <p>{formatCurrency(total, currency)}</p>
                    </div>

                    <div className="mt-4">
                      <Link href={DashboardLinks.orderDetail(id)} underlineOnHover={false}>
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

      {pagination && (
        <Table.Pagination
          page={pagination.page}
          limit={pagination.limit}
          totalItems={pagination.totalItems}
          onNext={pagination.onNext}
          onPrevious={pagination.onPrevious}
          onRowsPerPageChange={pagination.onRowsPerPageChange}
        />
      )}
    </Table>
  );
};

export default OrdersTable;
