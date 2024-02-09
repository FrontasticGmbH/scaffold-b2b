import React from 'react';
import Table from '@/components/atoms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { PencilSquareIcon as EditIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import { CompanyAdminPageProps } from '../../types';

const BusinessUnitsTable = ({ businessUnits = [] }: Partial<CompanyAdminPageProps>) => {
  const { translate } = useTranslation();
  return (
    <Table>
      <Table.Container>
        <Table.Head>
          <Table.Cell>{translate('common.name')}</Table.Cell>
          <Table.Cell>{translate('common.key')}</Table.Cell>
          <Table.Cell>{translate('common.email')}</Table.Cell>
          <Table.Cell />
        </Table.Head>
        <Table.Body>
          {businessUnits.map(({ id, name, key, email }) => (
            <Table.Row key={id}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{key}</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-end gap-5 text-primary">
                  <Link href={`?subPath=edit-business-unit&id=${id}`}>
                    <EditIcon className="cursor-pointer" width={20} />
                  </Link>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>
    </Table>
  );
};

export default BusinessUnitsTable;
