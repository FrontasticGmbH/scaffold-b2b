import React from 'react';
import Table from '@/components/atoms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { PencilSquareIcon as EditIcon, TrashIcon as DeleteIcon } from '@heroicons/react/24/outline';
import Confirmation from '@/components/organisms/confirmation';
import Link from '@/components/atoms/link';
import { CompanyAdminPageProps } from '../../types';

const AssociatesTable = ({ onDeleteAssociate, associates = [] }: Partial<CompanyAdminPageProps>) => {
  const { translate } = useTranslation();

  const isDeleteDisabled = associates.length === 1;

  return (
    <Table>
      <Table.Container>
        <Table.Head>
          <Table.Row>
            <Table.Cell>{translate('common.name')}</Table.Cell>
            <Table.Cell>{translate('common.email')}</Table.Cell>
            <Table.Cell>{translate('common.role')}</Table.Cell>
            <Table.Cell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {associates.map(({ id, firstName, lastName, email, role }) => (
            <Table.Row key={id}>
              <Table.Cell>{`${firstName} ${lastName}`}</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>{role}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-end gap-5 text-primary">
                  <Confirmation
                    translations={{
                      title: translate('dashboard.associate.delete'),
                      summary: translate(
                        isDeleteDisabled ? 'dashboard.associate.delete.disabled' : 'dashboard.associate.delete.confirm',
                      ),
                      cancel: translate(isDeleteDisabled ? 'common.close' : 'common.cancel'),
                      confirm: translate('common.delete'),
                    }}
                    disabled={isDeleteDisabled}
                    onConfirm={async () => onDeleteAssociate?.(id)}
                  >
                    <DeleteIcon className="cursor-pointer" width={20} />
                  </Confirmation>
                  <Link href={`?subPath=edit-associate&id=${id}`}>
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

export default AssociatesTable;
