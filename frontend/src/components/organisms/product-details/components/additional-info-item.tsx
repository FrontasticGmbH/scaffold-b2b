import Accordion from '@/components/molecules/accordion';
import { classnames } from '@/utils/classnames/classnames';
import { AdditionalInfoItemProps } from '../types';

const AdditionalInfoItem = ({ className, title, children }: AdditionalInfoItemProps) => {
  const itemClassName = classnames('border-x-0', className);

  return (
    <Accordion className={itemClassName}>
      <Accordion.Button defaultSpacing={false} className="px-2 py-5">
        <p className="text-14 font-semibold leading-tight text-gray-700 md:text-16">{title}</p>
      </Accordion.Button>
      <Accordion.Panel defaultSpacing={false} className="px-2 pb-6 pt-1">
        {children}
      </Accordion.Panel>
    </Accordion>
  );
};
export default AdditionalInfoItem;
