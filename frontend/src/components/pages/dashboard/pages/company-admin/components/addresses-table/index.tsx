import React, { useCallback } from 'react';
import Table from '@/components/organisms/table';
import { useTranslations } from 'use-intl';
import { PencilSquareIcon as EditIcon, TrashIcon as DeleteIcon } from '@heroicons/react/24/outline';
import Confirmation from '@/components/organisms/confirmation';
import Link from '@/components/atoms/link';
import useEntityToasters from '@/hooks/useEntityToasters';
import Accordion from '@/components/molecules/accordion';
import { CompanyAdminPageProps } from '../../types';

const AddressesTable = ({ onDeleteAddress, addresses = [], addressesAreViewOnly }: Partial<CompanyAdminPageProps>) => {
  const translate = useTranslations();

  const { showDeletedMessage, showDeletedFailedMessage } = useEntityToasters('address');

  const handleDelete = useCallback(
    async (id: string) => {
      const success = await onDeleteAddress?.(id);

      if (success) showDeletedMessage();
      else showDeletedFailedMessage();
    },
    [showDeletedMessage, showDeletedFailedMessage, onDeleteAddress],
  );

  return (
    <Table>
      <Table.Container className="hidden md:table">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{translate('common.name')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.use')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.address')}</Table.HeaderCell>
            <Table.HeaderCell>{`${translate('common.city')}, ${translate('common.state')}`}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.zipCode')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.country')}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {addresses.map(
            ({
              id,
              name,
              streetName,
              streetNumber,
              city,
              state,
              zip,
              country,
              isDefaultBilling,
              isDefaultShipping,
            }) => (
              <Table.Row key={id}>
                <Table.Cell>
                  <p className="w-24 truncate lg:w-full">{name} </p>
                </Table.Cell>
                <Table.Cell>
                  {isDefaultBilling || isDefaultShipping ? (
                    <>
                      <span className="text-14">{translate('dashboard.default-for')}</span>{' '}
                      <span className="text-14 font-medium lowercase">
                        {[
                          ...(isDefaultShipping ? [translate('common.shipping')] : []),
                          ...(isDefaultBilling ? [translate('common.billing')] : []),
                        ].join(', ')}
                      </span>
                    </>
                  ) : (
                    '-'
                  )}
                </Table.Cell>
                <Table.Cell>{`${streetName} ${streetNumber}`}</Table.Cell>
                <Table.Cell>
                  <span className="text-14">
                    {city}, {state}
                  </span>
                </Table.Cell>
                <Table.Cell>{zip}</Table.Cell>
                <Table.Cell>{country}</Table.Cell>
                <Table.Cell>
                  {!addressesAreViewOnly && (
                    <div className="flex items-center justify-end gap-5 text-primary">
                      <Confirmation
                        translations={{
                          title: translate('dashboard.address-delete'),
                          summary: translate('dashboard.address-delete-confirm'),
                          cancel: translate('common.cancel'),
                          confirm: translate('common.delete'),
                        }}
                        onConfirm={async () => handleDelete(id)}
                      >
                        <DeleteIcon className="cursor-pointer" width={20} />
                      </Confirmation>
                      <Link aria-label={translate('dashboard.address-edit')} href={`?subPath=edit-address&id=${id}`}>
                        <EditIcon className="cursor-pointer" width={20} />
                      </Link>
                    </div>
                  )}
                </Table.Cell>
              </Table.Row>
            ),
          )}
        </Table.Body>
      </Table.Container>

      <Table.Container className="table md:hidden">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{translate('common.name')}</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {addresses.map(
            ({
              id,
              name,
              streetName,
              streetNumber,
              city,
              state,
              zip,
              country,
              isDefaultBilling,
              isDefaultShipping,
            }) => (
              <Table.Row key={id}>
                <Table.Cell>
                  <Accordion className="border-none text-gray-600">
                    <Accordion.Button defaultSpacing={false}>
                      <p className="mb-2 w-80 truncate font-semibold">{name}</p>
                      <p className="mb-2 flex items-center gap-2">
                        <span className="basis-24 font-semibold uppercase">{translate('common.use')}: </span>
                        {isDefaultBilling || isDefaultShipping ? (
                          <>
                            <span>{translate('dashboard.default-for')}</span>{' '}
                            <span className="font-medium lowercase">
                              {[
                                ...(isDefaultShipping ? [translate('common.shipping')] : []),
                                ...(isDefaultBilling ? [translate('common.billing')] : []),
                              ].join(', ')}
                            </span>
                          </>
                        ) : (
                          '-'
                        )}
                      </p>
                      <p className="mb-2 flex gap-2">
                        <span className="basis-24 font-semibold uppercase">{translate('common.address')}: </span>{' '}
                        <span className="w-52 truncate">{`${streetName} ${streetNumber}`}</span>
                      </p>
                    </Accordion.Button>
                    <Accordion.Panel defaultSpacing={false}>
                      <p className="mb-2 flex gap-2">
                        <span className="basis-24 font-semibold uppercase">{`${translate('common.city')}`}:</span>
                        <span>
                          {city}, {state}
                        </span>
                      </p>
                      <p className="mb-2 flex gap-2">
                        <span className="basis-24 font-semibold uppercase">{translate('common.zipCode')}:</span>{' '}
                        <span>{zip}</span>
                      </p>
                      <p className="mb-2 flex gap-2">
                        <span className="basis-24 font-semibold uppercase">{translate('common.country')}:</span>{' '}
                        <span>{country}</span>
                      </p>
                      {!addressesAreViewOnly && (
                        <div className="mt-3 flex gap-5 text-primary">
                          <Confirmation
                            translations={{
                              title: translate('dashboard.address-delete'),
                              summary: translate('dashboard.address-delete-confirm'),
                              cancel: translate('common.cancel'),
                              confirm: translate('common.delete'),
                            }}
                            onConfirm={async () => handleDelete(id)}
                          >
                            <DeleteIcon className="cursor-pointer" width={24} />
                          </Confirmation>
                          <Link
                            aria-label={translate('dashboard.address-edit')}
                            href={`?subPath=edit-address&id=${id}`}
                          >
                            <EditIcon className="cursor-pointer" width={24} />
                          </Link>
                        </div>
                      )}
                    </Accordion.Panel>
                  </Accordion>
                </Table.Cell>
              </Table.Row>
            ),
          )}
        </Table.Body>
      </Table.Container>
    </Table>
  );
};

export default AddressesTable;
