import { AbstractPage } from './abstract-page';
import { Language } from './language';
import { Page } from './page';

export class CustomPage extends AbstractPage {
  page: Page;
  language: Language;
}
