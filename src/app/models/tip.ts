import {Resource} from './resource';
import {AbstractTip} from './abstract-tip';

export class Tip extends AbstractTip {
  name: string;
  resource: Resource;
  position: number;
}
