import Typography from '@/components/atoms/typography';
import Select from '@/components/atoms/select';
import { TypographyProps } from '@/components/atoms/typography/types';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { SpecsVariantsProps } from '../types';

const SpecsVariants = ({ specs, currentSpecs, onChangeSpecs }: SpecsVariantsProps) => {
  const { translate } = useTranslation();

  const commonTypographyProps: TypographyProps = {
    className: 'text-grey-700',
    lineHeight: 'loose',
    fontSize: 14,
  };

  return (
    <div className="grid gap-3">
      <div className="flex gap-1">
        <Typography {...commonTypographyProps}>{`${translate('common.model')}:`}</Typography>
        <Typography {...commonTypographyProps} fontWeight="medium">
          {currentSpecs.label}
        </Typography>
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
