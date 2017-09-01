import {Translation} from './translation';
import {Page} from './page';
import {System} from './system';
import {ResourceType} from './resource-type';
import {Attachment} from './attachment';

export class Resource {
  id: number;
  name: string;
  abbreviation: string;
  system: System;
  resourceType: ResourceType;
  oneskyProjectId: number;
  description: string;
  manifest: string;
  showTranslations: boolean;
  translations: Translation[];
  attachments: Attachment[];
  pages: Page[];
  latest: Translation[];
  data: { id: number };

  getResourceTypeId(): number {
    return this.resourceType ? this.resourceType.id : null;
  }

  getSystemId(): number {
    return this.system ? this.system.id : null;
  }
}
