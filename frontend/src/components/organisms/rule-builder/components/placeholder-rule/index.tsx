import React from 'react';
import Select from '@/components/atoms/select';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { TrashIcon as RemoveIcon } from '@heroicons/react/24/outline';
import Button from '@/components/atoms/button';
import { classnames } from '@/utils/classnames/classnames';
import { PlaceholderRuleProps } from './types';
import ValueSelector from '../value-selector';

const PlaceholderRule = ({ rule, singleMode, translations, criteria, onUpdate, onRemove }: PlaceholderRuleProps) => {
  const { translate } = useTranslation();

  const selectedCriteria = criteria.find((c) => c.key === rule.key);

  const addIsDisabled = (!singleMode && (!rule.key || !rule.operator || !rule.value)) || (singleMode && !rule.key);

  return (
    <div className="grid grid-cols-12 gap-3">
      <Select
        options={criteria.map(({ key, name }) => ({ name, value: key }))}
        value={rule.key}
        className="col-span-3"
        placeholder={translate('common.select.predicate')}
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
            className="col-span-3"
            disabled={!rule.key}
            onChange={(val) => onUpdate({ ...rule, value: val })}
          />
        </>
      )}

      <div className={classnames('flex gap-2', singleMode ? 'col-span-9' : 'col-span-4')}>
        <Button size="icon" variant="secondary" icon={<RemoveIcon width={20} height={20} />} onClick={onRemove} />
        <Button
          variant="secondary"
          disabled={addIsDisabled}
          onClick={() => onUpdate({ ...rule, isPlaceholder: false })}
        >
          {translations?.addRule ?? translate('dashboard.add.rule')}
        </Button>
        <Button
          variant="secondary"
          disabled={addIsDisabled}
          onClick={() => onUpdate({ type: 'group', combinator: 'AND', rules: [{ ...rule, isPlaceholder: false }] })}
        >
          {translations?.addSubgroup ?? translate('dashboard.add.subgroup')}
        </Button>
      </div>
    </div>
  );
};

export default PlaceholderRule;
