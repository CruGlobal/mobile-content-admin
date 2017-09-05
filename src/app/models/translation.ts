import {Language} from './language';
import {Resource} from './resource';

export class Translation {
  id: number;
  code: string;
  is_published: boolean;
  language: Language;
  resource: Resource;

  show: boolean;
  generateDraft: boolean;

  copy(): Translation {
    const copy = new Translation();

    copy.id = this.id;
    copy.code = this.code;
    copy.is_published = this.is_published;
    copy.language = this.language;
    copy.resource = this.resource;

    return copy;
  }
}
