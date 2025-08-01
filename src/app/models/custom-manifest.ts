import { AbstractPage } from './abstract-page';
import { Language } from './language';
import { Resource } from './resource';

export class CustomManifest extends AbstractPage {
  resource: Resource;
  language: Language;

  static copy(orig: CustomManifest): CustomManifest {
    const manifest = new CustomManifest();
    manifest.id = orig.id;
    manifest.resource = orig.resource;
    manifest.language = orig.language;
    manifest.structure = orig.structure;
    return manifest;
  }
}
