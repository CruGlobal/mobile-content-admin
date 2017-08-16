import {Component, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceService} from '../../service/resource.service';
import {Router} from '@angular/router';
import {Translation} from '../../models/translation';
import {LanguageService} from '../../service/language.service';

@Component({
  selector: 'admin-resources',
  templateUrl: './resources.component.html'
})
export class ResourcesComponent implements OnInit {
  resources: Resource[];
  translations: Translation[];
  selectedResource: Resource;

  constructor(private resourceService: ResourceService,
              private languageService: LanguageService,
              private router: Router) {}
  onSelect(resource: Resource): void {
    this.selectedResource = resource;
  }
  ngOnInit(): void {
    this.getResources();
  }
  getResources(): void {
    this.resourceService.getResources().then(resources => this.resources = resources);
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
}
