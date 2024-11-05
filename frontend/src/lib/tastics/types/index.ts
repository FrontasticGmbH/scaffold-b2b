import { Params, SearchParams } from '@/types/next';
import { TasticConfiguration } from '@frontastic/extension-types';
import { ProjectSettings } from '@shared/types/ProjectSettings';

export interface TasticProps<T = object> {
  data: T & TasticConfiguration;
  params: Params;
  searchParams: SearchParams;
  projectSettings?: ProjectSettings;
}

export interface TasticRegistry {
  [key: string]: (props: TasticProps) => JSX.Element | Promise<JSX.Element>;
}
