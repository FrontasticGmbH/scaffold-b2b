import React from 'react';
import Table from '@/components/atoms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import useFormat from '@/hooks/useFormat';

import QuoteStatusTag from '@/components/pages/dashboard/components/quote-status-tag';
import { QuotesPageProps } from '../../types';

const QuotesTable = ({
  quotes,
  totalItems = 0,
  page = 1,
  onPageChange,
  onRowsPerPageChange,
  limit = 25,
}: Partial<QuotesPageProps>) => {
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
              <Table.Cell>{creationDate}</Table.Cell>
              <Table.Cell>{businessUnit}</Table.Cell>
              <Table.Cell className="text-right">{formatCurrency(total, currency)}</Table.Cell>
              <Table.Cell isButtonsCell>
                <div className="flex justify-end">
                  <Link href={url} underlineOnHover={false}>
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

export default QuotesTable;
