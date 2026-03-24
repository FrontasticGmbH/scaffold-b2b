import React from 'react';
import Table from '@/components/organisms/table';
import { useTranslations } from 'use-intl';
import { PencilSquareIcon as EditIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import { CompanyAdminPageProps } from '../../types';

const BusinessUnitsTable = ({ businessUnitsAreViewOnly, businessUnits = [] }: Partial<CompanyAdminPageProps>) => {
  const translate = useTranslations();
  return (
    <Table>
      <Table.Container>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{translate('common.name')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.key')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('dashboard.toplevel-unit')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('dashboard.parent-unit')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.email')}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {businessUnits.map(({ id, name, key, email, topLevelUnit, parentUnit }) => (
            <Table.Row key={id}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>{topLevelUnit?.name || topLevelUnit?.key || '-'}</Table.Cell>
              <Table.Cell>{parentUnit?.name || parentUnit?.key || '-'}</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>
                {!businessUnitsAreViewOnly && (
                  <div className="flex items-center justify-end gap-5 text-primary">
                    <Link href={`?subPath=edit-business-unit&id=${id}`}>
                      <EditIcon className="cursor-pointer" width={20} />
                    </Link>
                  </div>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
    </Table>
  );
};

export default BusinessUnitsTable;
