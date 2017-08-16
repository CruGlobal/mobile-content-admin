import {Page} from './page';
import {Language} from './language';
import {AbstractPage} from './abstract-page';

export class CustomPage extends AbstractPage {
  page: Page;
  language: Language;
}
