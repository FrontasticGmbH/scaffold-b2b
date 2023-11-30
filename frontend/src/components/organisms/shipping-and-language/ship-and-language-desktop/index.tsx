import React from 'react';
import Typography from '@/components/atoms/typography';
import FlagIconsSquare from '@/components/atoms/icons/flag-icons-square';
import Radio from '@/components/atoms/radio';
import PopoverButton from '@/components/molecules/popover';
import useTranslation from '@/providers/I18n/hooks/useTranslation';
import useDisclosure from '@/hooks/useDisclosure';
import { useShipAndLanguage } from '@/providers/ship-and-language';
import { deskTopProps } from '../types';
import FlagButton from './flag-button';

const ShipAndLanguageSectionDesktop = ({ direction = 'right' }: deskTopProps) => {
  const { translate } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { locations, selectedLocation, selectedLanguage, onLocationSelect, onLanguageSelect } = useShipAndLanguage();

  return (
    <PopoverButton
      isOpen={isOpen}
      onClose={onClose}
      direction={direction}
      buttonElement={() => (
        <FlagButton onOpen={onOpen} selectedLanguage={selectedLanguage} selectedShip={selectedLocation} />
      )}
    >
      <div className="w-[270px] p-4">
        <Typography fontSize={14} fontWeight="semibold" className="text-gray-800">
          {translate('common.shop.ship.title')}
        </Typography>
        <div className="flex flex-col gap-y-5 pt-5">
          {locations.map((location) => (
            <Radio
              key={location.value}
              checked={selectedLocation?.value === location.value}
              onSelected={() => onLocationSelect(location.value)}
              label={
                <div className="flex items-center justify-start gap-5">
                  <FlagIconsSquare name={location.flagName} />
                  <Typography fontSize={14}>{location.label}</Typography>
                </div>
              }
            />
          ))}
        </div>

        {selectedLocation?.languages && selectedLocation.languages.length > 0 && (
          <div className="pt-5">
            <Typography fontSize={14} fontWeight="semibold" className="text-gray-800">
              {translate('common.language')}
            </Typography>
            <div className="flex flex-col gap-y-5 pt-5">
              {selectedLocation?.languages.map((language) => (
                <Radio
                  key={language.value}
                  checked={language.value === (selectedLanguage?.value ?? selectedLocation?.defaultLanguage)}
                  onSelected={() => onLanguageSelect(language.value)}
                  label={language.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PopoverButton>
  );
};
export default ShipAndLanguageSectionDesktop;
