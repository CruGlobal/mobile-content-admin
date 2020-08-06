import { Resource } from './resource';
import { AbstractPage } from './abstract-page';

export class Page extends AbstractPage {
  filename: string;
  resource: Resource;
  position: number;
}
