import { Resource } from './resource';
import { Language } from './language';
import { CustomPage } from './custom-page';
import { CustomTip } from './custom-tip';

export class ResourceLanguage {
  id: string;
  includeTips: boolean;
  resource: Resource;
  language: Language;
  customPages: CustomPage[];
  customTips: CustomTip[];
  'attr-include-tips': 'true' | 'false';
}
