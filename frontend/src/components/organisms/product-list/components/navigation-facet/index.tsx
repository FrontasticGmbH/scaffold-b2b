import React, { useCallback } from 'react';
import { BaseFacet, NavigationFacet as NavigationFacetType } from '@/types/entity/facet';
import { classnames } from '@/utils/classnames/classnames';
import ShowMore from '@/components/molecules/show-more';
import { useProductList } from '../../context';
import ShowMoreLabel from '../show-more-label';

const NavigationFacet = (facet: NavigationFacetType) => {
  const { onRefine } = useProductList();

  const refine = useCallback(
    (id: string) => {
      const value = facet.values.find((v) => v.id === id);

      onRefine({
        ...facet,
        values: [
          ...facet.values.filter((v) => v.id !== id).map((v) => ({ ...v, selected: false })),
          { ...(value as BaseFacet), selected: true },
        ],
        selected: true,
      });
    },
    [onRefine, facet],
  );

  const renderValues = useCallback(
    (values: BaseFacet[]) => {
      return values.map((value) => (
        <span
          key={value.id}
          onClick={() => refine(value.id)}
          className={classnames('cursor-pointer text-14 text-gray-600 underline-offset-2 hover:underline lg:text-16', {
            'font-semibold': value.selected,
          })}
        >
          {value.name} ({value.count})
        </span>
      ));
    },
    [refine],
  );

  return (
    <div className="flex flex-col gap-6">
      {renderValues(facet.values.slice(0, facet.maxVisibleItems ?? facet.values.length))}

      {facet.maxVisibleItems && facet.maxVisibleItems < facet.values.length && (
        <ShowMore renderLabel={ShowMoreLabel}>
          <div className="flex flex-col gap-6 pb-6">
            {renderValues(facet.values.slice(facet.maxVisibleItems ?? facet.values.length))}
          </div>
        </ShowMore>
      )}
    </div>
  );
};

export default NavigationFacet;
