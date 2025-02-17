import React from 'react';
import Table from '@/components/organisms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import ApprovalFlowStatusTag from '@/components/pages/dashboard/components/approval-flow-status-tag';
import useFormat from '@/hooks/useFormat';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import Accordion from '@/components/molecules/accordion';
import { Props } from './types';

const ApprovalFlowsTable = ({ approvalFlows, pagination }: Props) => {
  const { translate } = useTranslation();

  const { formatCurrency } = useFormat();

  return (
    <Table className="mt-5 rounded-md lg:mt-8">
      <Table.Container className="hidden text-gray-600 md:table">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{translate('common.status')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.id')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.date')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.business.unit')}</Table.HeaderCell>
            <Table.HeaderCell className="text-right">{translate('common.total')}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {approvalFlows.map(({ id, status, date, businessUnit, order }) => (
            <Table.Row key={id}>
              <Table.Cell>
                <ApprovalFlowStatusTag status={status} />
              </Table.Cell>
              <Table.Cell>
                <p className="w-40 truncate text-12 md:text-14 lg:w-full">{id}</p>
              </Table.Cell>
              <Table.Cell>{date ? new Date(date).toLocaleDateString() : ''}</Table.Cell>
              <Table.Cell>
                <p className="w-40 truncate text-14 lg:w-full">{businessUnit.name ?? businessUnit.key}</p>
              </Table.Cell>
              <Table.Cell className="text-right">
                {formatCurrency(order?.total ?? 0, order?.currency ?? 'USD')}
              </Table.Cell>
              <Table.Cell isButtonsCell>
                <div className="flex justify-end">
                  <Link href={DashboardLinks.approvalFlowDetail(id)}>
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
            <Table.HeaderCell>{translate('common.id')}</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {approvalFlows.map(({ id, status, date, businessUnit, order }) => (
            <Table.Row key={id}>
              <Table.Cell>
                <Accordion className="border-none text-gray-600">
                  <Accordion.Button defaultSpacing={false}>
                    <p className="text-14 font-semibold">{id}</p>
                    <p className="my-2 text-sm text-gray-500">{date ? new Date(date).toLocaleDateString() : ''}</p>
                    <ApprovalFlowStatusTag status={status} />
                  </Accordion.Button>
                  <Accordion.Panel defaultSpacing={false}>
                    <div className="mt-3 flex gap-1">
                      <p className="basis-32 font-semibold uppercase">{translate('common.business.unit')}: </p>
                      <p className="max-w-48 truncate">{businessUnit.name ?? businessUnit.key}</p>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <p className="basis-32 font-semibold uppercase">{translate('common.total')}:</p>
                      <p>{formatCurrency(order?.total ?? 0, order?.currency ?? 'USD')}</p>
                    </div>
                    <div className="mt-3">
                      <Link href={DashboardLinks.approvalFlowDetail(id)}>
                        <Button variant="secondary" size="m">
                          {translate('common.view')}
                        </Button>
                      </Link>
                    </div>
                  </Accordion.Panel>
                </Accordion>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>

      {pagination && <Table.Pagination {...pagination} />}
    </Table>
  );
};

export default ApprovalFlowsTable;
