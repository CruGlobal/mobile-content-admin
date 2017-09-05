import {Component} from '@angular/core';
import {Resource} from '../../models/resource';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'admin-multiple-draft-generator',
  templateUrl: './multiple-draft-generator.component.html'
})
export class MultipleDraftGeneratorComponent {
  resource: Resource;

  constructor(private ngbActiveModal: NgbActiveModal) {}

  generateDrafts(): void {
    this.ngbActiveModal.close();
  }

  cancel(): void {
    this.ngbActiveModal.dismiss();
  }
}
