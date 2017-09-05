import {Language} from './language';
import {Resource} from './resource';

export class Translation {
  id: number;
  code: string;
  is_published: boolean;
  language: Language;
  resource: Resource;
  show: boolean;

  constructor(translation: Translation) {
    this.id = translation.id;
    this.code = translation.code;
    this.is_published = translation.is_published;
    this.language = translation.language;
    this.resource = translation.resource;
  }
}
