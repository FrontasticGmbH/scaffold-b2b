import React, { useCallback, useState } from 'react';
import Table from '@/components/organisms/table';
import { useTranslations } from 'use-intl';
import Tag from '@/components/atoms/tag';
import { DocumentDuplicateIcon as DuplicateIcon, PencilSquareIcon as EditIcon } from '@heroicons/react/24/outline';
import Link from '@/components/atoms/link';
import { Tooltip } from 'react-tooltip';
import LoadingIcon from '@/components/atoms/loading-icon';
import { ApprovalRule } from '@/types/entity/approval-rule';
import { classnames } from '@/utils/classnames/classnames';
import { Props } from './types';

const ApprovalRulesTable = ({ approvalRules, onDuplicate, pagination, viewOnly }: Props) => {
  const translate = useTranslations();

  const [isDuplicating, setIsDuplicating] = useState<Record<number, boolean>>({});

  const handleDuplicate = useCallback(
    async (approvalRule: ApprovalRule, index: number) => {
      setIsDuplicating({ ...isDuplicating, [index]: true });
      await onDuplicate?.(approvalRule);
      setIsDuplicating({ ...isDuplicating, [index]: false });
    },
    [onDuplicate, isDuplicating],
  );

  return (
    <Table>
      <Table.Container className="table">
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>{translate('common.name')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.requesters')}</Table.HeaderCell>
            <Table.HeaderCell>{translate('common.status')}</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {approvalRules.map((approvalRule, index) => (
            <Table.Row key={approvalRule.id}>
              <Table.Cell>
                <div className="max-w-[40vw] truncate">{approvalRule.name}</div>
              </Table.Cell>
              <Table.Cell>{approvalRule.requesters.map((r) => r.name ?? r.key ?? '').join(', ')}</Table.Cell>
              <Table.Cell>
                <Tag variant={approvalRule.status === 'active' ? 'success' : 'danger'}>
                  {translate(`common.status-${approvalRule.status}`)}
                </Tag>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center justify-end gap-5 text-primary">
                  <Link
                    aria-label={translate('dashboard.edit-approval-rule')}
                    href={!viewOnly ? `?subPath=edit-approval-rule&id=${approvalRule.id}` : '#'}
                  >
                    <EditIcon
                      className={classnames({ 'cursor-not-allowed opacity-30': viewOnly, 'cursor-pointer': !viewOnly })}
                      width={20}
                      data-tooltip-id={`${approvalRule.id}-edit-tooltip`}
                      data-tooltip-content={translate('dashboard.edit-approval-rule')}
                    />
                    <Tooltip id={`${approvalRule.id}-edit-tooltip`} place="top" />
                  </Link>

                  <div className="hidden">
                    {isDuplicating[index] ? (
                      <LoadingIcon svgWidth={20} svgHeight={20} className="fill-primary" />
                    ) : (
                      <>
                        <DuplicateIcon
                          className="cursor-pointer"
                          width={20}
                          onClick={() => handleDuplicate(approvalRule, index)}
                          data-tooltip-id={`${approvalRule.id}-duplicate-tooltip`}
                          data-tooltip-content={translate('dashboard.duplicate-approval-rule')}
                        />
                        <Tooltip id={`${approvalRule.id}-duplicate-tooltip`} place="top" />
                      </>
                    )}
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Container>

      {pagination && <Table.Pagination {...pagination} />}
    </Table>
  );
};

export default ApprovalRulesTable;
