import React from 'react';
import Accordion from '@/components/molecules/accordion';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Radio from '@/components/atoms/radio';
import { useProductList } from '../../context';
import useFacetComponent from '../../hooks/useFacetComponent';

const Facets = () => {
  const { translate } = useTranslation();

  const { sortValues, currentSortValue, currentSortVector, onSortValueChange, facets } = useProductList();

  const { resolveFacetComponent } = useFacetComponent();

  return (
    <div>
      <div className="border-b border-neutral-400 xl:hidden">
        <Accordion className="border-none">
          <Accordion.Button className="py-5" defaultSpacing={false}>
            <span className="text-14 font-bold capitalize xl:text-16">{translate('product.sortBy')}</span>
          </Accordion.Button>
          <Accordion.Panel defaultSpacing={false} className="pb-6">
            <div className="flex flex-col gap-7">
              {sortValues.map(({ name, value, vector }) => (
                <Radio
                  key={value}
                  label={name}
                  checked={value === currentSortValue && vector === currentSortVector}
                  onSelected={() => onSortValueChange(value, vector)}
                />
              ))}
            </div>
          </Accordion.Panel>
        </Accordion>
      </div>

      {facets.map((facet) => (
        <div key={facet.id} className="border-b border-neutral-400">
          <Accordion className="border-none">
            <Accordion.Button className="py-5" defaultSpacing={false}>
              <span className="text-14 font-bold text-gray-700">{facet.name}</span>
            </Accordion.Button>
            <Accordion.Panel defaultSpacing={false} className="pb-6">
              {resolveFacetComponent(facet)}
            </Accordion.Panel>
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default Facets;
