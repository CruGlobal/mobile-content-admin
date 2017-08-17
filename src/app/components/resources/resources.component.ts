import {Component, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceService} from '../../service/resource.service';
import {Router} from '@angular/router';
import {Translation} from '../../models/translation';
import {LanguageService} from '../../service/language.service';
import {SystemService} from '../../service/system.service';
import {System} from '../../models/system';
import {ResourceType} from '../../models/resource-type';
import {ResourceTypeService} from '../../service/resource-type.service';

@Component({
  selector: 'admin-resources',
  templateUrl: './resources.component.html'
})
export class ResourcesComponent implements OnInit {
  newResource: Resource = new Resource;
  resources: Resource[];
  resourceTypes: ResourceType[];
  systems: System[];
  translations: Translation[];
  selectedResource: Resource;

  constructor(private resourceService: ResourceService,
              private languageService: LanguageService,
              private systemService: SystemService,
              private resourceTypeService: ResourceTypeService,
              private router: Router) {}
  onSelect(resource: Resource): void {
    this.selectedResource = resource;
  }
  ngOnInit(): void {
    this.resourceService.getResources().then(resources => this.resources = resources);
    this.resourceTypeService.getResourceTypes().then(types => this.resourceTypes = types);
    this.systemService.getSystems().then(systems => {
      this.systems = systems;
      this.newResource.system = this.systems[0];
    });
  }
  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedResource.id]);
  }
  loadTranslations(resource): void {
    this.resourceService.getResource(resource.id)
      .then((r) => {
        resource.latest = r['latest-translations'];

        resource.latest.forEach((translation) => {
          this.languageService.getLanguage(translation.language.id)
            .then((language) => {
              translation.language = language;
              translation.is_published = translation['is-published'];
            });
        });
      });

    resource.showTranslations = true; // TODO remove this
  }

  createResource(): void {
    console.log(this.newResource);
    this.resourceService.create(this.newResource).then();
  }
}
