import type { JSX } from 'react';

import { Params, SearchParams } from '@/types/next';
import { TasticConfiguration } from '@frontastic/extension-types';
import { Category } from '@shared/types/product';
import { ProjectSettings } from '@shared/types/ProjectSettings';

export interface TasticProps<T = object> {
  data: T & TasticConfiguration;
  params: Params;
  searchParams: SearchParams;
  projectSettings?: ProjectSettings;
  flatCategories?: Category[];
  treeCategories?: Category[];
}

export interface TasticRegistry {
  [key: string]: (props: TasticProps) => JSX.Element | Promise<JSX.Element>;
}
