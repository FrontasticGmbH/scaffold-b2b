import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import FlagIcons from '@/components/atoms/icons/flag-icons';
import { useTranslations } from 'use-intl';
import Dropdown from '@/components/atoms/dropdown';
import { useShipAndLanguage } from '@/providers/ship-and-language';
import { HeaderContext } from '@/components/organisms/header/context';
import { Location } from '../../types';

const ShippingSelect = () => {
  const { locations, selectedLocation, onLocationSelect } = useShipAndLanguage();
  const { showMenu } = useContext(HeaderContext);
  const translate = useTranslations();
  const [shippingMenuTop, setShippingMenuTop] = useState(false);
  const locationButtonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (locationButtonRef.current) {
      if (window.innerHeight - locationButtonRef.current.getBoundingClientRect().bottom < 70) setShippingMenuTop(true);
      else setShippingMenuTop(false);
    }
  }, [showMenu]);

  const menuClassName = shippingMenuTop ? 'bottom-12 shadow-500-reverse' : 'shadow-500';

  const getOptionDisplay = (location?: Location) => {
    return (
      <div className="flex h-6 items-center gap-x-2" onClick={() => onLocationSelect(location?.value ?? '')}>
        <FlagIcons name={location?.flagName ?? ''} className="size-4" />
        <p className="text-14 text-gray-800">{location?.name}</p>
      </div>
    );
  };
  return (
    <div className="pt-2" ref={locationButtonRef}>
      <p className="text-14 font-semibold text-gray-800">{translate('common.shop-ship-title')}</p>
      <div className="z-[150] pt-2">
        <Dropdown>
          <Dropdown.Button>
            {({ selected }) => (
              <span>
                {selected.value
                  ? getOptionDisplay(locations.find((location) => location.value === selected.value) as Location)
                  : getOptionDisplay(selectedLocation)}
              </span>
            )}
          </Dropdown.Button>
          <Dropdown.Options className={menuClassName}>
            {locations.map((location) => (
              <Dropdown.Option key={location.label} value={location.value}>
                {getOptionDisplay(location)}
              </Dropdown.Option>
            ))}
          </Dropdown.Options>
        </Dropdown>
      </div>
    </div>
  );
};

export default ShippingSelect;
