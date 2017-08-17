import {Translation} from './translation';
import {Page} from './page';
import {System} from './system';
import {ResourceType} from './resource-type';

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
  pages: Page[];
  latest: Translation[];
  data: { id: number };
}
