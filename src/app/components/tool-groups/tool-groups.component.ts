import { Component, OnInit } from '@angular/core';
import { Resource } from '../../models/resource';
import { ResourceService } from '../../service/resource/resource.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreateResourceComponent } from '../edit-resource/create-resource/create-resource.component';
import { Language } from '../../models/language';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'admin-tool-groups',
  templateUrl: './tool-groups.component.html',
})
export class ToolGroupsComponent implements OnInit {
  resources: Resource[];
  showInstructions = false;
  loadingResources = false;
  errorMessage: string;

  constructor(
    private resourceService: ResourceService,
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loadingResources = true;

    this.resourceService
      .getResources(
        'latest-drafts-translations,pages,custom-manifests,tips,attachments,variants',
      )
      .then((resources) => {
        this.resources = resources;
      })
      .catch(this.handleError.bind(this))
      .then(() => (this.loadingResources = false));
  }

  trackByFunction(pIx: number, pItem: Resource) {
    if (!pItem || pIx < 0) {
      return null;
    }
    return pItem.id;
  }


  private handleError(message): void {
    this.errorMessage = message;
  }
}
