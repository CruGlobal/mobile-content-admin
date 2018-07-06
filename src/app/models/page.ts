import {Resource} from './resource';
import {AbstractPage} from './abstract-page';

export class Page extends AbstractPage {
  filename: string;
  resource: Resource;
  position: number;

  static compare(a: Page, b: Page): number {
    if (a.position < b.position) {
      return -1;
    } else if (a.position > b.position) {
      return 1;
    }
    return 0;
  }
}
