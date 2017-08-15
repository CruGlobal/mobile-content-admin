import {Resource} from './resource';

export class Attachment {
  id: number;
  file: string;
  resource: Resource;
  is_zipped: boolean;
}
