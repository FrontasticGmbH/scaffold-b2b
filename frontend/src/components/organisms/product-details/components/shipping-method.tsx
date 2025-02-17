import Typography from '@/components/atoms/typography';
import { classnames } from '@/utils/classnames/classnames';
import { TruckIcon } from '@heroicons/react/24/outline';
import { ShippingMethodProps } from '../types';

const ShippingMethod = ({ className, label, description }: ShippingMethodProps) => {
  const methodClassName = classnames('flex items-center gap-5 rounded-md border-neutral-400 p-4', className);

  return (
    <div className={methodClassName}>
      <TruckIcon width={24} height={24} />
      <div className="grid gap-2">
        {/* Label & Price */}
        <div className="flex flex-wrap gap-4">
          <Typography className="text-gray-700" fontSize={14} fontWeight="medium" lineHeight="tight">
            {description}
          </Typography>
        </div>

        {/* Est. delivery date */}
        <div>
          <Typography className="text-gray-600" fontSize={14} lineHeight="tight">
            {label}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
