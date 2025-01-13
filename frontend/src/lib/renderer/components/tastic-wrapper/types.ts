import { DataSources } from '@/types/lib/datasources';
import { Params, SearchParams } from '@/types/next';
import { Tastic } from '@frontastic/extension-types';
import { Category } from '@shared/types/product';
import { ProjectSettings } from '@shared/types/ProjectSettings';

export type TasticWrapperProps = {
  dataSources: DataSources | null;
  data: Tastic;
  params: Params;
  searchParams: SearchParams;
  isHighlighted?: boolean;
  projectSettings?: ProjectSettings;
  flatCategories?: Category[];
  treeCategories?: Category[];
};
