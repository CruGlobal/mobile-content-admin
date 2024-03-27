import { Language } from './language';
import { Resource } from './resource';

export class Translation {
  id: number;
  code: string;
  is_published: boolean;
  language: Language;
  resource: Resource;
  version: number;

  generateDraft: boolean;
  none: boolean;

  static copy(translation: Translation): Translation {
    const copy = new Translation();

    copy.id = translation.id;
    copy.code = translation.code;
    copy.is_published = translation.is_published;
    copy.language = translation.language;
    copy.resource = translation.resource;
    copy.version = translation.version;

    return copy;
  }
}
