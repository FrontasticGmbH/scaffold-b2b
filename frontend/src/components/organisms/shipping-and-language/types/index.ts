import { Option } from '@/components/atoms/select/types';

type Direction = 'left' | 'right';

export interface Location {
  flagName: string;
  name: string;
  label: string;
  value: string;
  defaultLanguage: string;
  languages: Option[];
}

export interface ShipAndLanguageProps {
  desktopDirection?: 'left' | 'right';
}

export interface ContextShape {
  selectedLanguage?: Option;
  selectedLocation?: Location;
  locations: Location[];
  onLanguageSelect: (lang: string) => void;
  onLocationSelect: (location: string) => void;
}

export interface deskTopProps {
  direction: Direction;
}

export interface FlagButtonProps {
  selectedShip?: Location;
  selectedLanguage?: Option;
  onOpen: () => void;
}
