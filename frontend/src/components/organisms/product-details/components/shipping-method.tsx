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
          <p className="text-14 font-medium leading-tight text-gray-700">{description}</p>
        </div>

        {/* Est. delivery date */}
        <div>
          <p className="text-14 leading-tight text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
