import { Resource } from './resource';

export class AttributeTranslation {
  id?: string;
  key: string;
  'crowdin-phrase-id': string;
  required: boolean;
  resource?: Resource;
}

export interface IAttributeTranslationPromises {
  type: String;
  id: String;
  data: AttributeTranslation;
}
