import { Translation } from './translation';
import { Page } from './page';
import { Tip } from './tip';
import { System } from './system';
import { ResourceType } from './resource-type';
import { Attachment } from './attachment';
import { CustomManifest } from './custom-manifest';

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
  tips: Tip[];
  latest: Translation[];
  data: { id: number };
  customManifests: CustomManifest[];
  aboutOverviewVideoYoutube?: string;
  bannerAbout?: number;
  banner?: number;
  'attr-category'?:
    | 'articles'
    | 'conversation_starter'
    | 'gospel'
    | 'growth'
    | 'training';
  'attr-default-order'?: number;

  static getResourceTypeId(resource: Resource): number {
    return resource.resourceType ? resource.resourceType.id : null;
  }

  static getSystemId(resource: Resource): number {
    return resource.system ? resource.system.id : null;
  }
}
