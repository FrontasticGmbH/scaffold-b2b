import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import Typography from '@/components/atoms/typography';
import FlagIcons from '@/components/atoms/icons/flag-icons';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import Dropdown from '@/components/atoms/dropdown';
import { useShipAndLanguage } from '@/providers/ship-and-language';
import { HeaderContext } from '@/components/organisms/header/context';
import { Location } from '../../types';

const ShippingSelect = () => {
  const { locations, selectedLocation, onLocationSelect } = useShipAndLanguage();
  const { showMenu } = useContext(HeaderContext);
  const { translate } = useTranslation();
  const [shippingMenuTop, setShippingMenuTop] = useState(false);
  const locationButtonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (locationButtonRef.current) {
      if (window.innerHeight - locationButtonRef.current.getBoundingClientRect().bottom < 70) setShippingMenuTop(true);
      else setShippingMenuTop(false);
    }
  }, [showMenu]);

  const menuClassName = shippingMenuTop ? 'bottom-12 shadow-500-reverse' : 'shadow-500';

  const getOptionDisplay = (location: Location) => {
    return (
      <div className="flex h-6 items-center gap-x-2" onClick={() => onLocationSelect(location.value)}>
        <FlagIcons name={location.flagName} className="h-4 w-4" />
        <Typography fontSize={14} className="text-gray-800">
          {location.name}
        </Typography>
      </div>
    );
  };

  return (
    <div className="pt-2" ref={locationButtonRef}>
      <Typography fontSize={14} fontWeight="semibold" className="text-gray-800">
        {translate('common.shop.ship.title')}
      </Typography>
      <div className="z-[150] pt-2">
        <Dropdown>
          <Dropdown.Button>
            {({ selected }) => (
              <span>
                {selected.value
                  ? getOptionDisplay(locations.find((location) => location.value === selected.value) as Location)
                  : getOptionDisplay(selectedLocation ?? locations[0])}
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
