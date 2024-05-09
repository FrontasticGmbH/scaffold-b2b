import React from 'react';
import Table from '@/components/organisms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import useFormat from '@/hooks/useFormat';
import { Quote } from '@/types/entity/quote';
import QuoteStatusTag from '@/components/pages/dashboard/components/quote-status-tag';
import { TablePaginationProps } from '@/components/organisms/table/types';

interface QuotesTableProps {
  quotes: Quote[];
  pagination: TablePaginationProps;
}

const QuotesTable: React.FC<QuotesTableProps> = ({ quotes, pagination }) => {
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
          {(quotes ?? []).map(({ id, status, creationDate, businessUnit, total, currency, isNew, url }) => (
            <Table.Row key={id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <QuoteStatusTag status={status} />
                  {isNew && (
                    <div className="flex items-center gap-1">
                      <span className="h-[6px] w-[6px] rounded-full bg-[#2A4DA8]" />
                      <span className="text-12 text-gray-500 lg:block">{translate('common.reply')}</span>
                    </div>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="block max-w-full truncate text-12 md:text-14">{id}</span>
              </Table.Cell>
              <Table.Cell>{creationDate ? new Date(creationDate).toLocaleDateString() : '-'}</Table.Cell>
              <Table.Cell>{businessUnit}</Table.Cell>
              <Table.Cell className="text-right">{formatCurrency(total, currency)}</Table.Cell>
              <Table.Cell isButtonsCell>
                <div className="flex justify-end">
                  {url && (
                    <Link href={url} underlineOnHover={false}>
                      <Button variant="secondary">{translate('common.view')}</Button>
                    </Link>
                  )}
                </div>
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

export default QuotesTable;
