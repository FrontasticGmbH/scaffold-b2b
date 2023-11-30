import { Attribute } from './Attribute';

export interface Attributes {
  [key: string]: Attribute;
}

export interface Content {
  contentId: string;
  contentTypeId: string;
  name?: string;
  attributes?: Attributes;
}
