import { Resource } from './resource';

export class AttributeTranslation {
  id?: number;
  key: string;
  'onesky-phrase-id': string;
  required: boolean;
  resource?: Resource;
}