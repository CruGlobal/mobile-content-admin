import { Component, OnInit } from '@angular/core';
import { Resource } from '../../models/resource';
import { ResourceService } from '../../service/resource/resource.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreateResourceComponent } from '../edit-resource/create-resource/create-resource.component';
import { Language } from '../../models/language';
import { LanguageService } from '../../service/language.service';
import { ResourceType } from '../../../../src/app/models/resource-type';
import { System } from '../../../../src/app/models/system';
import { Filters } from '../../../../src/app/models/filters';
import { SystemService } from '../../../../src/app/service/system.service';
import { ResourceTypeService } from '../../../../src/app/service/resource-type.service';

@Component({
  selector: 'admin-resources',
  templateUrl: './resources.component.html',
})
export class ResourcesComponent implements OnInit {
  resources: Resource[];
  unfilteredResources: Resource[];
  languages: Language[];
  resourceTypes: ResourceType[];
  systems: System[];

  showInstructions = false;
  loadingResources = false;
  loadingLanguages = false;
  errorMessage: string;
  filters: Filters;
  totalFilters: number;
  sortOrder: string;

  constructor(
    private resourceService: ResourceService,
    private languageService: LanguageService,
    private modalService: NgbModal,
    protected systemService: SystemService,
    protected resourceTypeService: ResourceTypeService,
  ) {}

  ngOnInit(): void {
    this.loadResources();
    this.loadLanguages();
    this.loadFilters();
  }

  getBlankFilters(): Filters {
    return {
      type: [],
      system: [],
      other: [],
    };
  }

  loadResources(): void {
    this.resourceService
      .getResources(
        'latest-drafts-translations,pages,custom-manifests,tips,attachments,variants',
      )
      .then((resources) => {
        this.unfilteredResources = resources;
        this.filterAndSort();
      })
      .catch(this.handleError.bind(this))
      .then(() => (this.loadingResources = false));
  }
  filterAndSort(): void {
    const localFilters = localStorage.getItem('filters');
    this.sortOrder = localStorage.getItem('sortOrder');
    this.filters = localFilters
      ? JSON.parse(localFilters)
      : this.getBlankFilters();
    this.totalFilters = Object.keys(this.filters).reduce(
      (acc, item) => acc + this.filters[item].length,
      0,
    );

    this.resources = this.filters
      ? this.unfilteredResources.filter((resource) => {
          if (this.filters['type'].length) {
            if (!this.filters['type'].includes(resource['resource-type'])) {
              return false;
            }
          }
          if (this.filters['system'].length) {
            if (!this.filters['system'].includes(resource['system']['id'])) {
              return false;
            }
          }
          if (this.filters['other'].length) {
            if (
              !resource['attr-hidden'] ||
              (resource['attr-hidden'] &&
                !this.filters['other'].includes('hidden'))
            ) {
              return false;
            }
          }
          return true;
        })
      : this.unfilteredResources;

    if (this.sortOrder === 'content') {
      this.resources.sort(
        (a, b) =>
          (a['attr-default-order'] || 1000) - (b['attr-default-order'] || 1000),
      );
    }
  }
  loadFilters(): void {
    this.resourceTypeService.getResourceTypes().then((types) => {
      this.resourceTypes = types;
    });
    this.systemService.getSystems().then((systems) => {
      this.systems = systems;
    });
  }

  openCreateModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(
      CreateResourceComponent,
      { size: 'lg' },
    );
    modalRef.result.then(() => this.loadResources(), console.log);
  }

  toggleResources = function (
    category: string,
    optionId: string | number,
  ): void {
    const updatedFilters = this.filters[category]
      ? this.filters[category].includes(optionId)
        ? {
            ...this.filters,
            [category]: this.filters[category].filter((e) => e !== optionId),
          }
        : {
            ...this.filters,
            [category]: [...this.filters[category], optionId],
          }
      : {
          ...this.filters,
          [category]: [optionId],
        };
    localStorage.setItem('filters', JSON.stringify(updatedFilters));
    this.filterAndSort();
  };

  clearFilters = function (): void {
    localStorage.setItem('filters', JSON.stringify(this.getBlankFilters()));
    this.filterAndSort();
  };
  updateSort = function (order: string): void {
    localStorage.setItem('sortOrder', order);
    this.filterAndSort();
  };

  trackByFunction(pIx: number, pItem: Resource) {
    if (!pItem || pIx < 0) {
      return null;
    }
    return pItem.id;
  }

  private loadLanguages(): void {
    this.loadingLanguages = true;

    this.languageService
      .getLanguages()
      .then((languages) => (this.languages = languages))
      .catch(this.handleError.bind(this))
      .then(() => (this.loadingLanguages = false));
  }

  private handleError(message): void {
    this.errorMessage = message;
  }
}
