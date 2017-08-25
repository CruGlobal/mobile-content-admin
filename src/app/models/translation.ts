import {Language} from './language';
import {Resource} from './resource';
export class Translation {
  id: number;
  code: string;
  is_published: boolean;
  language: Language;
  resource: Resource;
  show: boolean;
}
