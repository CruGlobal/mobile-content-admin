import {Component, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceService} from '../../service/resource.service';
import {LanguageService} from '../../service/language.service';

@Component({
  selector: 'admin-resources',
  templateUrl: './resources.component.html'
})
export class ResourcesComponent implements OnInit {
  resources: Resource[];

  constructor(private resourceService: ResourceService, private languageService: LanguageService) {}

  ngOnInit(): void {
    this.resourceService.getResources(null).then(resources => this.resources = resources);
  }

  loadTranslations(resource): void {
    let x = 0;
    this.resourceService.getResource(resource.id, 'translations,pages').then((r) => {
      resource.latest = r['latest-translations'];

      resource.latest.forEach((translation) => {
        this.languageService.getLanguage(translation.language.id, 'custom_pages').then((language) => {
          x++;

          translation.language = language;
          translation.is_published = translation['is-published'];

          if (x === resource.latest.length) {
            resource.showTranslations = true;
          }
        });
      });
    });
  }
}
