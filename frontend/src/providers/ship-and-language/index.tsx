import React, { createContext, useContext, useState } from 'react';
import { useParams } from 'next/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { Option } from '@/components/atoms/select/types';
import usePath from '@/hooks/usePath';
import { ContextShape, Location } from '@/components/organisms/shipping-and-language/types';

const initialMarketState = {
  selectedLanguage: {} as Option,
  selectedLocation: {} as Location,
  locations: [] as Location[],
} as ContextShape;

export const ShipAndLanguageContext = createContext(initialMarketState);

const ShipAndLanguageProvider = ({ children }: React.PropsWithChildren) => {
  const router = useCustomRouter();
  const { path } = usePath();

  const locations = [
    {
      flagName: 'sweden',
      name: 'Sweden',
      label: 'Sweden (SEK)',
      value: 'sv',
      defaultLanguage: 'sv',
      languages: [
        { name: 'Svenska - SV', value: 'sv' },
        { name: 'English - EN', value: 'en' },
      ],
    },
    {
      flagName: 'US',
      name: 'United States',
      label: 'United States (USD)',
      value: 'en',
      defaultLanguage: 'en',
      languages: [{ name: 'English - EN', value: 'en' }],
    },
  ] as Location[];

  const parameters = useParams();
  const [selectedLocationValue, setSelectedLocationValue] = useState(parameters.locale);
  const selectedLocation = locations.find((location) => location.value === selectedLocationValue);
  const selectedLanguage = selectedLocation?.languages.find((language) => language.value === parameters.locale);

  const onLanguageSelect = (language: string) => {
    router.push(path, { locale: language });
  };

  const onLocationSelect = (location: string) => {
    const locationObject = locations.find((l) => l.value === location);

    setSelectedLocationValue(location);
    if (!locationObject?.languages.find((language) => language.value === parameters.locale))
      onLanguageSelect(locationObject?.defaultLanguage ?? '');
  };

  return (
    <ShipAndLanguageContext.Provider
      value={{
        selectedLanguage,
        selectedLocation,
        locations,
        onLanguageSelect,
        onLocationSelect,
      }}
    >
      {children}
    </ShipAndLanguageContext.Provider>
  );
};
export default ShipAndLanguageProvider;
export const useShipAndLanguage = () => useContext(ShipAndLanguageContext);
