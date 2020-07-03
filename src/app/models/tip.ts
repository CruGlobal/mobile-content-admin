import {Resource} from './resource';
import {AbstractTip} from './abstract-tip';

export class Tip extends AbstractTip {
  filename: string;
  resource: Resource;
  position: number;
}
