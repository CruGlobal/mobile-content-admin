import { Input, OnDestroy, ViewChild, Directive } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AceEditorDirective } from 'ng2-ace-editor';
import { Language } from '../../models/language';
import { Resource } from '../../models/resource';
import { ResourceType } from '../../models/resource-type';
import { System } from '../../models/system';
import { LanguageService } from '../../service/language.service';
import { ResourceService } from '../../service/resource/resource.service';
import { ResourceTypeService } from '../../service/resource-type.service';
import { SystemService } from '../../service/system.service';

@Directive()
export abstract class AbstractEditResourceComponent implements OnDestroy {
  saving = false;
  errorMessage: string;

  @ViewChild(AceEditorDirective) editor;

  @Input() resource: Resource = new Resource();
  metatools: Resource[];
  resourceTypes: ResourceType[];
  systems: System[];
  languages: Language[];

  protected constructor(
    protected systemService: SystemService,
    protected resourceTypeService: ResourceTypeService,
    protected resourceService: ResourceService,
    protected languageService: LanguageService,
    protected activeModal: NgbActiveModal,
  ) {}

  init(resourceTypesCallback, systemsCallback): void {
    this.resourceTypeService
      .getResourceTypes()
      .then((types) => {
        this.resourceTypes = types;

        if (resourceTypesCallback) {
          resourceTypesCallback.call();
        }
      })
      .catch((error) => this.handleError(error));

    this.systemService
      .getSystems()
      .then((systems) => {
        this.systems = systems;

        if (systemsCallback) {
          systemsCallback.call();
        }
      })
      .catch((error) => this.handleError(error));

    this.resourceService
      .getResources()
      .then((tools) => {
        this.metatools = tools.filter((tool) => Resource.isMetaTool(tool));
      })
      .catch((error) => this.handleError(error));

    this.languageService
      .getLanguages()
      .then((languages) => {
        this.languages = languages;
      })
      .catch((error) => this.handleError(error));
  }

  ngOnDestroy(): void {
    // HACK: workaround this bug: https://github.com/ajaxorg/ace/issues/4042
    //       ng2-ace-editor uses brace@0.11.1 which bundles an older version of ace without the fix
    this.editor?.editor?.renderer?.freeze();
  }

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  isMetaTool(): boolean {
    return Resource.isMetaTool(this.resource);
  }

  hasUnknownDefaultLocale(): boolean {
    const code = this.resource['attr-default-locale'];
    return (
      !!code &&
      !!this.languages &&
      !this.languages.some((language) => language.code === code)
    );
  }

  compareTools(o1: any, o2: any): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected saveResource(): void {
    this.activeModal.close('closed');
  }
}
