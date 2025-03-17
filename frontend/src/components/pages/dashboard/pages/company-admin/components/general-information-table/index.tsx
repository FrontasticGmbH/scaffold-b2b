import React from 'react';
import Table from '@/components/organisms/table';
import { useTranslations } from 'use-intl';
import { PencilSquareIcon as EditIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import { CompanyAdminPageProps } from '../../types';

const GeneralInformationTable = ({
  generalInformation = [],
  businessUnitsAreViewOnly,
}: Partial<CompanyAdminPageProps>) => {
  const translate = useTranslations();

  return (
    <Table>
      <Table.Container>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{translate('common.name')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.email')}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {generalInformation.map(({ id, name, email }) => (
            <Table.Row key={id}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>
                {!businessUnitsAreViewOnly && (
                  <div className="flex justify-end">
                    <Link aria-label={translate('common.edit')} href={`?subPath=edit-general-info&id=${id}`}>
                      <EditIcon className="cursor-pointer text-primary" width={20} />
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

export default GeneralInformationTable;
