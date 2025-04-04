import Select from '@/components/atoms/select';
import { useTranslations } from 'use-intl';
import { SpecsVariantsProps } from '../types';

const SpecsVariants = ({ specs, currentSpecs, onChangeSpecs }: SpecsVariantsProps) => {
  const translate = useTranslations();

  return (
    <div className="grid gap-3">
      <div className="flex gap-1">
        <p className="text-14 leading-loose text-gray-700">{`${translate('common.model')}:`}</p>
        <p className="text-14 font-medium leading-loose text-gray-700">{currentSpecs.label}</p>
      </div>

      <Select
        value={currentSpecs.value}
        options={specs.map((specsVariant) => ({
          name: specsVariant.label,
          value: specsVariant.value,
        }))}
        onChange={(value) => onChangeSpecs(value)}
      ></Select>
    </div>
  );
};

export default SpecsVariants;
