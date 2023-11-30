import { TasticRegistry } from '@/lib/tastics/types';
import { DataSources } from '@/types/lib/datasources';
import { SearchParams } from '@/types/next';
import { Tastic } from '@frontastic/extension-types';

export type TasticWrapperProps = {
  dataSources: DataSources | null;
  tastics: TasticRegistry;
  data: Tastic;
  searchParams: SearchParams;
  isHighlighted?: boolean;
};
