import React from 'react';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { BaseFacet } from '@/types/entity/facet';
import { useProductList } from '../../context';
import Refinement from '../refinement';

const CurrentRefinements = () => {
  const { translate } = useTranslation();

  const { facets, onRefine, onResetAll } = useProductList();

  const appliedFacets = facets.filter((facet) => facet.selected).length > 0;

  return (
    <div className="flex flex-wrap gap-3">
      {appliedFacets && (
        <div
          className="flex h-[32px] cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-2 transition hover:bg-gray-50"
          onClick={onResetAll}
        >
          <span className="text-14 leading-[20px] text-gray-700">{translate('product.clear.all')}</span>
        </div>
      )}

      {facets
        .filter((facet) => facet.selected)
        .map((facet) => {
          if (facet.type === 'term' || facet.type === 'navigation')
            return (
              <React.Fragment key={facet.id}>
                {facet.values
                  .filter((value) => value.selected)
                  .map((value) => (
                    <Refinement
                      key={`${facet.id}-${value.id}`}
                      name={value.name}
                      onRemove={() => {
                        const values = [
                          ...facet.values.filter((v) => v.id !== value.id),
                          { ...(value as BaseFacet), selected: false },
                        ];

                        onRefine({
                          ...facet,
                          values,
                          selected: values.some((value) => value.selected),
                        });
                      }}
                    />
                  ))}
              </React.Fragment>
            );

          return (
            <Refinement key={facet.id} name={facet.name} onRemove={() => onRefine({ ...facet, selected: false })} />
          );
        })}
    </div>
  );
};

export default CurrentRefinements;
