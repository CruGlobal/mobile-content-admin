import { AbstractTip } from './abstract-tip';
import { Language } from './language';
import { Tip } from './tip';

export class CustomTip extends AbstractTip {
  tip: Tip;
  language: Language;
}
