import { AbstractTip } from './abstract-tip';
import { Resource } from './resource';

export class Tip extends AbstractTip {
  name: string;
  resource: Resource;
  position: number;
}
