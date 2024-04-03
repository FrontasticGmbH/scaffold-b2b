import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Typography from '@/components/atoms/typography';
import { AdditionalInfoProps } from '../types';
import AdditionalInfoItem from './additional-info-item';

const AdditionalInfo = ({ className, description, specifications }: AdditionalInfoProps) => {
  const { translate } = useTranslation();

  return (
    <div className={className}>
      <AdditionalInfoItem className="border-b-0" title={translate('product.details')}>
        {description}
      </AdditionalInfoItem>

      <AdditionalInfoItem title={translate('product.specifications')}>
        <div className="grid gap-3">
          {specifications?.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <Typography as="span" fontWeight="medium" className="capitalize">
                {`${spec.label}:`}
              </Typography>
              <Typography as="span">{spec.value}</Typography>
            </div>
          ))}
        </div>
      </AdditionalInfoItem>
    </div>
  );
};

export default AdditionalInfo;
