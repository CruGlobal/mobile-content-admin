import {Resource} from './resource';
import {Language} from './language';
import {CustomPage} from './custom-page';
import {CustomTip} from './custom-tip';
import {System} from './system';

export class ResourceLanguage {
  id: number;
  includeTips: boolean;
  system: System;
  resource: Resource;
  language: Language;
  customPages: CustomPage[];
  customTips: CustomTip[];

  static getSystemId(resource: Resource): number {
    return resource.system ? resource.system.id : null;
  }
}
