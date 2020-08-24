import { Language } from '../../models/language';
import { Resource } from '../../models/resource';
import { Translation } from '../../models/translation';

export const getLatestTranslation = (
  resource: Resource,
  language: Language,
): Translation => {
  let latest = resource['latest-drafts-translations'].find(
    (t) => t.language.id === language.id,
  );

  if (!latest) {
    latest = new Translation();
    latest.language = language;
    latest.resource = resource;
    latest.none = true;
  }

  return latest;
};
