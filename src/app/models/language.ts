import {CustomPage} from './custom-page';

export class Language {
  id: number;
  name: string;
  code: string;
  customPages: CustomPage[];
  data: { id: number };
}
