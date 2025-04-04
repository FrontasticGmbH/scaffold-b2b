import { useTranslations } from 'use-intl';
import ColoredVariant from '@/components/atoms/colored-variants';
import { ColorVariantsProps } from '../types';

const ColorVariants = ({ currentColor, colors, onChangeColor }: ColorVariantsProps) => {
  const translate = useTranslations();

  return (
    <div className="grid gap-4">
      <div className="flex gap-1">
        <p className="text-14 leading-loose text-gray-700">{`${translate('product.color')}:`}</p>
        <p className="text-14 font-medium leading-loose text-gray-700">{currentColor?.label}</p>
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
