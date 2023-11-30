import { FC } from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { classnames } from '@/utils/classnames/classnames';
import LoadingIcon from '@/components/atoms/loading-icon';
import { ButtonProps, ButtonVariant } from '../types';

type FeedbackIconLayerProps = {
  loading?: ButtonProps['loading'];
  variant: ButtonProps['variant'];
};

const FeedbackIconLayer: FC<FeedbackIconLayerProps> = ({ loading, variant = 'primary' }) => {
  const variantBackgroundRef: { [key in ButtonVariant]?: string } = {
    primary: 'bg-secondary',
    warning: 'bg-red-600',
  };

  const iconInWhite = variant == 'primary' || variant == 'warning';

  const layerClassName = classnames(
    'absolute left-0 top-0 grid h-full w-full items-center justify-center',
    variantBackgroundRef[variant] ?? 'bg-white',
  );

  const checkIconClassName = classnames('w-5', { 'text-white': iconInWhite });
  const loadingIconClassName = iconInWhite ? 'fill-white' : 'fill-gray-700';

  return (
    <span className={layerClassName}>
      {loading ? (
        <LoadingIcon svgWidth={20} svgHeight={20} className={loadingIconClassName} />
      ) : (
        <CheckIcon className={checkIconClassName} />
      )}
    </span>
  );
};

export default FeedbackIconLayer;
