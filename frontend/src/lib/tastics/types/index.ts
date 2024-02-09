import { Params, SearchParams } from '@/types/next';
import { TasticConfiguration } from '@frontastic/extension-types';

export interface TasticProps<T = object> {
  data: T & TasticConfiguration;
  params: Params;
  searchParams: SearchParams;
}

export interface TasticRegistry {
  [key: string]: (props: TasticProps) => JSX.Element | Promise<JSX.Element>;
}
