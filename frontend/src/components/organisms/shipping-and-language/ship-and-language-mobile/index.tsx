import React, { useContext } from 'react';
import Typography from '@/components/atoms/typography';
import Select from '@/components/atoms/select';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import { ShipAndLanguageContext } from '@/providers/ship-and-language';
import ShippingSelect from './shipping-select';

const ShippingAndLanguageSectionMobile = () => {
  const { selectedLocation, selectedLanguage, onLanguageSelect } = useContext(ShipAndLanguageContext);

  const { translate } = useTranslation();

  return (
    <div className="block border-t py-4 lg:hidden">
      <ShippingSelect />

      <div className="pt-5">
        <Typography fontSize={14} fontWeight="semibold" className="text-gray-800">
          {translate('common.language')}
        </Typography>
        <Select
          value={selectedLanguage?.value}
          className="pt-2"
          size="sm"
          placeholder="Select"
          options={selectedLocation?.languages ?? []}
          onChange={(value) => {
            onLanguageSelect(selectedLocation?.languages?.find((lang) => lang.value === value)?.value ?? '');
          }}
        />
      </div>
    </div>
  );
};
export default ShippingAndLanguageSectionMobile;
