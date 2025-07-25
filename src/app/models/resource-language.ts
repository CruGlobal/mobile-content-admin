import { CustomPage } from './custom-page';
import { CustomTip } from './custom-tip';
import { Language } from './language';
import { Resource } from './resource';

export class ResourceLanguage {
  id: string;
  includeTips: boolean;
  resource: Resource;
  language: Language;
  customPages: CustomPage[];
  customTips: CustomTip[];
  'attr-include-tips': 'true' | 'false';
}
