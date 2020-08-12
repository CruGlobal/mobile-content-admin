import { Component, Input } from '@angular/core';
import { Translation } from '../../../models/translation';

@Component({
  selector: 'admin-translation-version-badge',
  templateUrl: './translation-version-badge.component.html',
})
export class TranslationVersionBadgeComponent {
  @Input() translation: Translation;
}
