import { CustomPage } from './custom-page';

export class Language {
  id: number;
  name: string;
  code: string;
  direction: string;
  'crowdin-code': string;
  'force-language-name': boolean;
  customPages: CustomPage[];

  canConfirmDelete: boolean;
  isEditing: boolean;
}
