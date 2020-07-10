import {Tip} from './tip';
import {Language} from './language';
import {AbstractTip} from './abstract-tip';

export class CustomTip extends AbstractTip {
  tip: Tip;
  language: Language;
}
