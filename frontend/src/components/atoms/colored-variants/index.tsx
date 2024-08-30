import { ColoredVariantProps } from '@/components/organisms/product-details/types';
import { classnames } from '@/utils/classnames/classnames';

const ColoredVariant = ({ className, color, active, onClick }: ColoredVariantProps) => {
  const variantClassName = classnames(
    'h-9 w-9 cursor-pointer rounded-sm',
    { 'border-[1.5px] border-primary': active },
    className,
  );

  return <div role={'button'} className={variantClassName} style={{ backgroundColor: color }} onClick={onClick} />;
};

export default ColoredVariant;
