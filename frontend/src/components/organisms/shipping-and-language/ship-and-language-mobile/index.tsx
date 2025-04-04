import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import Select from '@/components/atoms/select';
import { useTranslations } from 'use-intl';
import { useShipAndLanguage } from '@/providers/ship-and-language';
import { HeaderContext } from '@/components/organisms/header/context';
import ShippingSelect from './shipping-select';

const ShippingAndLanguageSectionMobile = () => {
  const { selectedLocation, selectedLanguage, onLanguageSelect } = useShipAndLanguage();
  const { showMenu } = useContext(HeaderContext);
  const translate = useTranslations();
  const [languageMenuTop, setLanguageMenuTop] = useState(false);
  const languageButtonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (languageButtonRef.current) {
      if (window.innerHeight - languageButtonRef.current.getBoundingClientRect().bottom < 100) setLanguageMenuTop(true);
      else setLanguageMenuTop(false);
    }
  }, [showMenu]);

  return (
    <div className="block border-t py-4 lg:hidden">
      <ShippingSelect />

      <div className="pt-5" ref={languageButtonRef}>
        <p className="text-14 font-semibold text-gray-800">{translate('common.language')}</p>
        <Select
          menuTop={languageMenuTop}
          value={selectedLanguage?.value}
          className="pt-2"
          size="lg"
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
