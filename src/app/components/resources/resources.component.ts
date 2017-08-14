import {Component, OnInit} from '@angular/core';
import {Resource} from '../../models/resource';
import {ResourceService} from '../../service/resource.service';
import {Router} from '@angular/router';
import {Translation} from '../../models/translation';
import {LanguageService} from '../../service/language.service';
import {Language} from '../../models/language';

@Component({
  selector: 'my-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
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
        const latest_translations = r['data']['relationships']['latest-translations']['data']; // TODO move some to TranslationsComponent
        const included_objects = r['included'];
        resource.latest = included_objects.filter(object => latest_translations.some(translation => translation.id == object.id));

        resource.latest.forEach((translation) => {
          this.languageService.getLanguage(translation.relationships.language.data.id)
            .then((language) => {
              translation.language = language;
              translation.is_published = translation.attributes['is-published'];
            });
        });
      });

    resource.showTranslations = true; // TODO remove this
  }
}
