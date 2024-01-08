import Typography from '@/components/atoms/typography';
import { TypographyProps } from '@/components/atoms/typography/types';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import ColoredVariant from '@/components/atoms/colored-variants';
import { ColorVariantsProps } from '../types';

const ColorVariants = ({ currentColor, colors, onChangeColor }: ColorVariantsProps) => {
  const { translate } = useTranslation();

  const commonTypographyProps: TypographyProps = {
    className: 'text-grey-700',
    lineHeight: 'loose',
    fontSize: 14,
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-1">
        <Typography {...commonTypographyProps}>{`${translate('product.color')}:`}</Typography>
        <Typography {...commonTypographyProps} fontWeight="medium">
          {currentColor?.label}
        </Typography>
      </div>

      <div className="flex gap-3">
        {colors.map((colorVariant) => (
          <ColoredVariant
            key={colorVariant.value}
            color={colorVariant.value}
            active={colorVariant.value === currentColor.value}
            onClick={() => onChangeColor(colorVariant.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorVariants;
