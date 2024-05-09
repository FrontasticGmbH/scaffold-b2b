import React from 'react';
import Table from '@/components/organisms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { PencilSquareIcon as EditIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import { CompanyAdminPageProps } from '../../types';

const GeneralInformationTable = ({ generalInformation = [] }: Partial<CompanyAdminPageProps>) => {
  const { translate } = useTranslation();

  return (
    <Table>
      <Table.Container>
        <Table.Head>
          <Table.Cell>{translate('common.name')}</Table.Cell>
          <Table.Cell>{translate('common.email')}</Table.Cell>
          <Table.Cell />
        </Table.Head>
        <Table.Body>
          {generalInformation.map(({ id, name, email }) => (
            <Table.Row key={id}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>
                <div className="flex justify-end">
                  <Link href={`?subPath=edit-general-info&id=${id}`}>
                    <EditIcon className="cursor-pointer text-primary" width={20} />
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

export default GeneralInformationTable;
