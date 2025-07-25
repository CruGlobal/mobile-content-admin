import { AbstractPage } from './abstract-page';
import { Resource } from './resource';

export class Page extends AbstractPage {
  filename: string;
  resource: Resource;
  position: number;
}
