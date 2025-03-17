import React from 'react';
import Select from '@/components/atoms/select';
import Button from '@/components/atoms/button';
import { TrashIcon as RemoveIcon, PlusIcon as AddIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'use-intl';
import { classnames } from '@/utils/classnames/classnames';
import { RuleProps } from './types';
import ValueSelector from '../value-selector';

const Rule = ({ rule, singleMode, criteria, addButtonIsDisabled, onUpdate, onRemove, onAddNew }: RuleProps) => {
  const translate = useTranslations();

  const selectedCriteria = criteria.find((c) => c.key === rule.key);

  return (
    <div className="grid grid-cols-12 gap-3">
      <Select
        options={criteria.map(({ key, name }) => ({ name, value: key }))}
        value={rule.key}
        className="col-span-4"
        placeholder={translate('common.select-predicate')}
        onChange={(val) => onUpdate({ ...rule, key: val, operator: '', value: '' })}
      />

      {!singleMode && (
        <>
          <Select
            options={selectedCriteria?.operators ?? []}
            value={rule.operator}
            className="col-span-2"
            disabled={!rule.key}
            onChange={(val) => onUpdate({ ...rule, operator: val })}
          />
          <ValueSelector
            criteria={selectedCriteria}
            value={rule.value}
            className="col-span-4"
            disabled={!rule.key}
            onChange={(val) => onUpdate({ ...rule, value: val })}
          />
        </>
      )}

      <div className={classnames('flex gap-2', singleMode ? 'col-span-8' : 'col-span-2')}>
        <Button variant="secondary" size="l" Icon={RemoveIcon} onClick={onRemove} />
        <Button
          size="l"
          Icon={AddIcon}
          disabled={
            (!singleMode && (!rule.key || !rule.operator || !rule.value)) ||
            (singleMode && !rule.key) ||
            addButtonIsDisabled
          }
          onClick={onAddNew}
        />
      </div>
    </div>
  );
};

export default Rule;
