import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { Option } from '@/components/atoms/select/types';
import usePath from '@/hooks/usePath';
import { ContextShape, Location } from '@/components/organisms/shipping-and-language/types';
import { useSWRConfig } from 'swr';

const initialMarketState = {
  selectedLanguage: {} as Option,
  selectedLocation: {} as Location,
  locations: [] as Location[],
} as ContextShape;

export const ShipAndLanguageContext = createContext(initialMarketState);

const ShipAndLanguageProvider = ({ children }: React.PropsWithChildren) => {
  const { mutate } = useSWRConfig();
  const router = useCustomRouter();
  const { path } = usePath();

  const locations = [
    {
      flagName: 'us',
      name: 'United States',
      label: 'United States (USD)',
      value: 'us',
      defaultLanguage: 'en-us',
      languages: [{ name: 'English - US', value: 'en-us' }],
    },
    {
      flagName: 'gb',
      name: 'United Kingdom',
      label: 'United Kingdom (GBP)',
      value: 'gb',
      defaultLanguage: 'en-gb',
      languages: [{ name: 'English - GB', value: 'en-gb' }],
    },
    {
      flagName: 'au',
      name: 'Australia',
      label: 'Australia (AUD)',
      value: 'au',
      defaultLanguage: 'en-au',
      languages: [{ name: 'English - AU', value: 'en-au' }],
    },
    {
      flagName: 'nz',
      name: 'New Zealand',
      label: 'New Zealand (NZD)',
      value: 'nz',
      defaultLanguage: 'en-nz',
      languages: [{ name: 'English - NZ', value: 'en-nz' }],
    },
    {
      flagName: 'de',
      name: 'Germany',
      label: 'Germany (EUR)',
      value: 'de',
      defaultLanguage: 'de-de',
      languages: [{ name: 'German - DE', value: 'de-de' }],
    },
    {
      flagName: 'fr',
      name: 'France',
      label: 'France (EUR)',
      value: 'fr',
      defaultLanguage: 'fr-fr',
      languages: [{ name: 'French - FR', value: 'fr-fr' }],
    },
    {
      flagName: 'es',
      name: 'Spain',
      label: 'Spain (EUR)',
      value: 'es',
      defaultLanguage: 'es-es',
      languages: [{ name: 'Spanish - ES', value: 'es-es' }],
    },
    {
      flagName: 'pt',
      name: 'Portugal',
      label: 'Portugal (EUR)',
      value: 'pt',
      defaultLanguage: 'pt-pt',
      languages: [{ name: 'Portuguese - PT', value: 'pt-pt' }],
    },
    {
      flagName: 'nl',
      name: 'Netherlands',
      label: 'Netherlands (EUR)',
      value: 'nl',
      defaultLanguage: 'nl-nl',
      languages: [{ name: 'Dutch - NL', value: 'nl-nl' }],
    },
    {
      flagName: 'it',
      name: 'Italy',
      label: 'Italy (EUR)',
      value: 'it',
      defaultLanguage: 'it-it',
      languages: [{ name: 'Italian - IT', value: 'it-it' }],
    },
  ] as Location[];

  const { locale } = useParams();

  useEffect(() => {
    mutate((key: string[]) => key?.[0].startsWith('/action/cart/getCart'), undefined, { revalidate: true });
  }, [locale, mutate]);

  const [selectedLocationValue, setSelectedLocationValue] = useState(locale.split('-')[1]);

  const selectedLocation = locations.find((location) => location.value === selectedLocationValue);
  const selectedLanguage = selectedLocation?.languages.find((language) => language.value === locale);

  const onLanguageSelect = (language: string) => {
    router.push(path, { locale: language });
  };

  const onLocationSelect = (location: string) => {
    const locationObject = locations.find((l) => l.value === location);

    setSelectedLocationValue(location);

    if (!locationObject?.languages.find((language) => language.value === locale))
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
