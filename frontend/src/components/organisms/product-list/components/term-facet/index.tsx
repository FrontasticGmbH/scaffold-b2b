import React, { useCallback } from 'react';
import { BaseFacet, TermFacet as TermFacetType } from '@/types/entity/facet';
import Checkbox from '@/components/atoms/checkbox';
import ShowMore from '@/components/molecules/show-more';
import { useProductList } from '../../context';
import ShowMoreLabel from '../show-more-label';

const TermFacet = (facet: TermFacetType) => {
  const { onRefine } = useProductList();

  const refine = useCallback(
    (id: string, selected: boolean) => {
      const value = facet.values.find((v) => v.id === id);

      const values = [...facet.values.filter((v) => v.id !== id), { ...(value as BaseFacet), selected }];

      onRefine({
        ...facet,
        values,
        selected: values.some((value) => value.selected),
      });
    },
    [onRefine, facet],
  );

  const renderValues = useCallback(
    (values: BaseFacet[]) => {
      return values.map((value) => (
        <Checkbox
          key={value.id}
          label={`${value.name} (${value.count})`}
          checked={!!value.selected}
          onChecked={(checked) => refine(value.id, checked)}
          disabled={!value.count}
        />
      ));
    },
    [refine],
  );

  return (
    <div className="flex flex-col gap-7">
      {renderValues(facet.values.slice(0, facet.maxVisibleItems ?? facet.values.length))}

      {facet.maxVisibleItems && facet.maxVisibleItems < facet.values.length && (
        <ShowMore renderLabel={ShowMoreLabel}>
          <div className="flex flex-col gap-7 pb-7">{renderValues(facet.values.slice(facet.maxVisibleItems))}</div>
        </ShowMore>
      )}
    </div>
  );
};

export default TermFacet;
