import {Translation} from './translation';
export class Resource {
  id: number;
  name: string;
  showTranslations: boolean;
  translations: Translation[];
  latest: Translation[];
  data: { id: number };
}
