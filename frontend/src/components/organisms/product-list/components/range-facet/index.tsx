import React, { useCallback, useEffect, useState } from 'react';
import { RangeFacet as RangeFacetType } from '@/types/entity/facet';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Input from '@/components/atoms/input';
import Button from '@/components/atoms/button';
import { useProductList } from '../../context';

const RangeFacet = (facet: RangeFacetType) => {
  const { translate } = useTranslation();

  const [focused, setFocused] = useState({ min: false, max: false });

  const [range, setRange] = useState({
    min: facet.selected ? facet.min : undefined,
    max: facet.selected ? facet.max : undefined,
  });

  const { onRefine } = useProductList();

  const refine = useCallback(() => {
    onRefine({ ...facet, ...range, selected: true });
  }, [onRefine, facet, range]);

  useEffect(() => {
    if (!facet.selected) setRange({ min: undefined, max: undefined });
  }, [facet.selected]);

  return (
    <div className="flex items-stretch gap-3">
      <div className="flex grow items-center gap-2">
        <Input
          type="number"
          containerClassName="p-0 flex-1"
          className="py-3 pr-3 text-center text-14 placeholder:text-gray-600"
          placeholder={focused.min ? '' : translate('common.min')}
          value={range.min || ''}
          onChange={(e) => setRange({ ...range, min: +e.target.value })}
          onFocus={() => setFocused({ ...focused, min: true })}
          onBlur={() => setFocused({ ...focused, min: false })}
        />
        <span className="text-12 text-gray-500 lg:text-14">{translate('common.to')}</span>
        <Input
          type="number"
          containerClassName="p-0 flex-1"
          className="py-3 pr-3 text-center text-14 placeholder:text-gray-600"
          placeholder={focused.max ? '' : translate('common.max')}
          value={range.max || ''}
          onChange={(e) => setRange({ ...range, max: +e.target.value })}
          onFocus={() => setFocused({ ...focused, max: true })}
          onBlur={() => setFocused({ ...focused, max: false })}
        />
      </div>
      <Button variant="primary" className="shrink-0" onClick={refine}>
        {translate('common.apply')}
      </Button>
    </div>
  );
};

export default RangeFacet;
