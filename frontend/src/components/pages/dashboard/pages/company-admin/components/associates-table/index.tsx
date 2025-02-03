import React, { useCallback } from 'react';
import Table from '@/components/organisms/table';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { PencilSquareIcon as EditIcon, TrashIcon as DeleteIcon } from '@heroicons/react/24/outline';
import Confirmation from '@/components/organisms/confirmation';
import Link from '@/components/atoms/link';
import useEntityToasters from '@/hooks/useEntityToasters';
import { CompanyAdminPageProps } from '../../types';

const AssociatesTable = ({
  onDeleteAssociate,
  associatesAreViewOnly,
  associates = [],
}: Partial<CompanyAdminPageProps>) => {
  const { translate } = useTranslation();

  const { showDeletedMessage, showDeletedFailedMessage } = useEntityToasters('associate');

  const isDeleteDisabled = associates.length === 1;

  const handleDelete = useCallback(
    async (id: string) => {
      const success = await onDeleteAssociate?.(id);

      if (success) showDeletedMessage();
      else showDeletedFailedMessage();
    },
    [showDeletedMessage, showDeletedFailedMessage, onDeleteAssociate],
  );

  return (
    <Table>
      <Table.Container>
        <Table.Head>
          <Table.Cell isHeadCell>{translate('common.name')}</Table.Cell>
          <Table.Cell isHeadCell>{translate('common.email')}</Table.Cell>
          <Table.Cell isHeadCell>{translate('common.role')}</Table.Cell>
          <Table.Cell />
        </Table.Head>
        <Table.Body>
          {associates.map(({ id, firstName, lastName, email, roles }) => (
            <Table.Row key={id}>
              <Table.Cell>{firstName || lastName ? `${firstName} ${lastName}`.trim() : '-'}</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>{roles.join(', ')}</Table.Cell>
              <Table.Cell>
                {!associatesAreViewOnly && (
                  <div className="flex items-center justify-end gap-5 text-primary">
                    <Confirmation
                      translations={{
                        title: translate('dashboard.associate.delete'),
                        summary: translate(
                          isDeleteDisabled
                            ? 'dashboard.associate.delete.disabled'
                            : 'dashboard.associate.delete.confirm',
                        ),
                        cancel: translate(isDeleteDisabled ? 'common.close' : 'common.cancel'),
                        confirm: translate('common.delete'),
                      }}
                      disabled={isDeleteDisabled}
                      onConfirm={async () => handleDelete(id)}
                    >
                      <DeleteIcon className="cursor-pointer" width={20} />
                    </Confirmation>
                    <Link href={`?subPath=edit-associate&id=${id}`}>
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

export default AssociatesTable;
