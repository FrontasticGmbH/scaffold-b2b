import React from 'react';
import Table from '@/components/organisms/table';
import { useTranslations } from 'use-intl';
import Button from '@/components/atoms/button';
import Link from '@/components/atoms/link';
import useFormat from '@/hooks/useFormat';
import { Quote } from '@/types/entity/quote';
import QuoteStatusTag from '@/components/pages/dashboard/components/quote-status-tag';
import { TablePaginationProps } from '@/components/organisms/table/types';
import Accordion from '@/components/molecules/accordion';

interface QuotesTableProps {
  quotes: Quote[];
  pagination?: TablePaginationProps;
}

const QuotesTable: React.FC<QuotesTableProps> = ({ quotes, pagination }) => {
  const translate = useTranslations();

  const { formatCurrency } = useFormat();

  return (
    <Table className="mt-5 rounded-md lg:mt-8">
      <Table.Container className="hidden text-gray-600 md:table">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{translate('common.status')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.id')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.date')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.business-unit')}</Table.HeaderCell>
            <Table.HeaderCell className="text-right">{translate('common.total')}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {(quotes ?? []).map(({ id, status, creationDate, businessUnit, total, currency, isNew, url }) => (
            <Table.Row key={id}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <QuoteStatusTag status={status} />
                  {isNew && (
                    <div className="flex items-center gap-1">
                      <span className="size-[6px] rounded-full bg-blue-600" />
                      <span className="text-12 text-gray-500 lg:block">{translate('common.reply')}</span>
                    </div>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>
                <p className="w-36 truncate text-12 md:text-14 lg:w-full">{id}</p>
              </Table.Cell>
              <Table.Cell>{creationDate ? new Date(creationDate).toLocaleDateString() : '-'}</Table.Cell>
              <Table.Cell>
                <p className="w-36 truncate lg:w-full">{businessUnit}</p>
              </Table.Cell>
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

      {/* Mobile View */}

      <Table.Container className="table md:hidden">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{translate('common.id')}</Table.HeaderCell>
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {(quotes ?? []).map(({ id, status, creationDate, businessUnit, total, currency, isNew, url }) => (
            <Table.Row key={id}>
              <Table.Cell>
                <Accordion className="border-none text-14 text-gray-600">
                  <Accordion.Button defaultSpacing={false}>
                    <p className="text-14 font-semibold">{id}</p>
                    <p className="my-2 text-sm text-gray-500">
                      {creationDate ? new Date(creationDate).toLocaleDateString() : '-'}
                    </p>

                    <QuoteStatusTag status={status} />
                    {isNew && (
                      <div className="flex items-center gap-1">
                        <span className="size-[6px] rounded-full bg-blue-600" />
                        <span className="text-12 lg:block">{translate('common.reply')}</span>
                      </div>
                    )}
                  </Accordion.Button>

                  <Accordion.Panel defaultSpacing={false}>
                    <div className="mt-2 flex">
                      <p className="basis-32 text-14 font-semibold uppercase"> {translate('common.business-unit')}:</p>
                      <p className="w-48 truncate">{businessUnit}</p>
                    </div>
                    <div className="flex">
                      <p className="basis-32 text-14 font-semibold uppercase">{translate('common.total')}:</p>
                      <p>{formatCurrency(total, currency)}</p>
                    </div>
                    <div className="mt-4">
                      {url && (
                        <Link href={url} underlineOnHover={false}>
                          <Button variant="secondary">{translate('common.view')}</Button>
                        </Link>
                      )}
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

export default QuotesTable;
