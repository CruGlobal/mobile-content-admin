import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { ResourceService } from '../../service/resource/resource.service';
import { LanguageService } from '../../service/language.service';
import { Language } from '../../models/language';
import { ToolGroup } from '../../models/tool-group';
import { Resource } from '../../models/resource';
import { CreateToolGroupComponent } from '../edit-tool-group/create-tool-group/create-tool-group.component';

@Component({
  selector: 'admin-tool-groups',
  templateUrl: './tool-groups.component.html',
})
export class ToolGroupsComponent implements OnInit {
  toolGroups: ToolGroup[];
  showInstructions = false;
  loadingToolGroups = false;
  errorMessage: string;
  resources: Resource[];
  languages: Language[];

  constructor(
    private toolGroupService: ToolGroupService,
    private modalService: NgbModal,
    private resourceService: ResourceService,
    private languageService: LanguageService,
  ) {}

  ngOnInit(): void {
    this.loadToolGroups();
    this.resourceService.getResources().then((resources) => {
      this.resources = resources;
    });
    this.languageService.getLanguages().then((languages) => {
      this.languages = languages;
    });
  }

  loadToolGroups(): Promise<void> {
    this.loadingToolGroups = true;
    return this.toolGroupService
      .getToolGroups()
      .then((toolGroups) => {
        this.toolGroups = toolGroups;
      })
      .catch(this.handleError.bind(this))
      .then(() => {
        this.loadingToolGroups = false;
      });
  }

  trackByFunction(pIx: number, pItem: ToolGroup) {
    if (!pItem || pIx < 0) {
      return null;
    }
    return pItem.id;
  }

  openCreateModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(
      CreateToolGroupComponent,
    );
    modalRef.result.then(() => this.loadToolGroups(), console.log);
  }

  protected handleError(message): void {
    this.errorMessage = message;
  }
}
