import useTranslation from '@/providers/I18n/hooks/useTranslation';
import ProductAttributes from '@/components/molecules/product-attributes';
import { AdditionalInfoProps } from '../types';
import AdditionalInfoItem from './additional-info-item';

const AdditionalInfo = ({ className, description, specifications }: AdditionalInfoProps) => {
  const { translate } = useTranslation();

  return (
    <div className={className}>
      <AdditionalInfoItem className="border-b-0" title={translate('product.details')}>
        {description}
      </AdditionalInfoItem>

      {specifications && (
        <AdditionalInfoItem title={translate('product.specifications')}>
          <ProductAttributes className="grid gap-3" attributes={specifications} />
        </AdditionalInfoItem>
      )}
    </div>
  );
};

export default AdditionalInfo;
