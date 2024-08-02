import React from 'react';
import Table from '@/components/organisms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import ApprovalFlowStatusTag from '@/components/pages/dashboard/components/approval-flow-status-tag';
import useFormat from '@/hooks/useFormat';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import { DashboardLinks } from '@/components/pages/dashboard/constants';
import { Props } from './types';

const ApprovalFlowsTable = ({ approvalFlows, pagination }: Props) => {
  const { translate } = useTranslation();

  const { formatCurrency } = useFormat();

  return (
    <Table className="mt-5 rounded-md lg:mt-8">
      <Table.Container>
        <Table.Head>
          <Table.Cell>{translate('common.status')}</Table.Cell>
          <Table.Cell>{translate('common.id')}</Table.Cell>
          <Table.Cell>{translate('common.date')}</Table.Cell>
          <Table.Cell>{translate('common.business.unit')}</Table.Cell>
          <Table.Cell className="text-right">{translate('common.total')}</Table.Cell>
          <Table.Cell isButtonsHead />
        </Table.Head>
        <Table.Body>
          {approvalFlows.map(({ id, status, date, businessUnit, order }) => (
            <Table.Row key={id}>
              <Table.Cell>
                <ApprovalFlowStatusTag status={status} />
              </Table.Cell>
              <Table.Cell>
                <span className="block max-w-full truncate text-12 md:text-14">{id}</span>
              </Table.Cell>
              <Table.Cell>{date ? new Date(date).toLocaleDateString() : ''}</Table.Cell>
              <Table.Cell>{businessUnit.name ?? businessUnit.key}</Table.Cell>
              <Table.Cell className="text-right">
                {formatCurrency(order?.total ?? 0, order?.currency ?? 'USD')}
              </Table.Cell>
              <Table.Cell isButtonsCell>
                <div className="flex justify-end">
                  <Link href={DashboardLinks.approvalFlowDetail(id)}>
                    <Button variant="secondary" size="m">
                      {translate('common.view')}
                    </Button>
                  </Link>
                </div>
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
