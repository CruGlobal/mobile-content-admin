import {Resource} from './resource';
import {AbstractPage} from './abstract-page';

export class Page extends AbstractPage {
  filename: string;
  resource: Resource;
  position: number;

  static compare(a: Page, b: Page): number {
    return a.position - b.position;
  }
}
