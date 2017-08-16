import {Translation} from './translation';
import {Page} from './page';
export class Resource {
  id: number;
  name: string;
  showTranslations: boolean;
  translations: Translation[];
  pages: Page[];
  latest: Translation[];
  data: { id: number };
}
