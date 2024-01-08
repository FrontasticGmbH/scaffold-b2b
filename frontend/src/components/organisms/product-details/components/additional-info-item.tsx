import Typography from '@/components/atoms/typography';
import Accordion from '@/components/molecules/accordion';
import { classnames } from '@/utils/classnames/classnames';
import Markdown from '@/components/atoms/markdown';
import { AdditionalInfoItemProps } from '../types';

const AdditionalInfoItem = ({ className, title, description }: AdditionalInfoItemProps) => {
  const itemClassName = classnames('border-x-0', className);

  return (
    <Accordion className={itemClassName}>
      <Accordion.Button defaultSpacing={false} className="px-2 py-5">
        <Typography className="text-gray-700 md:text-16" lineHeight="tight" fontSize={14} fontWeight="semibold">
          {title}
        </Typography>
      </Accordion.Button>
      <Accordion.Panel defaultSpacing={false} className="px-2 pb-6 pt-1">
        <Markdown className="text-14 leading-loose text-gray-600 md:text-16">{description}</Markdown>
      </Accordion.Panel>
    </Accordion>
  );
};
export default AdditionalInfoItem;
