import { Language } from '../models/language';
import { Resource } from '../models/resource';
import { CountriesType, ToolGroup } from '../models/tool-group';

export class ToolGroupMocks {
  languageUKMock = {
    code: 'en-GB',
    name: 'English (British)',
    id: 5,
    customPages: null,
    canConfirmDelete: null,
  } as Language;

  languageUSMock = {
    code: 'en-US',
    name: 'English (American)',
    id: 2,
    customPages: null,
    canConfirmDelete: null,
  } as Language;

  countryUKMock = {
    code: 'GB',
    name: 'United Kingdom',
    native: 'United Kingdom',
    phone: '44',
    continent: 'EU',
    capital: 'London',
    currency: 'GBP',
    languages: ['en'],
    emoji: '🇬🇧',
    emojiU: 'U+1F1EC U+1F1E7',
  } as CountriesType;

  countryUSMock = {
    code: 'US',
    name: 'United States',
    native: 'United States',
    phone: '1',
    continent: 'NA',
    capital: 'Washington D.C.',
    currency: 'USD,USN,USS',
    languages: ['en'],
    emoji: '🇺🇸',
    emojiU: 'U+1F1FA U+1F1F8',
  } as CountriesType;

  countryADMock = {
    code: 'AD',
    name: 'Andorra',
    native: 'Andorra',
    phone: '376',
    continent: 'EU',
    capital: 'Andorra la Vella',
    currency: 'EUR',
    languages: ['ca'],
    emoji: '🇦🇩',
    emojiU: 'U+1F1E6 U+1F1E9',
  } as CountriesType;

  getLanguagesResponse = [
    {
      code: 'ar-SA',
      name: 'Arabic (Saudi Arabia)',
      id: 9,
      customPages: null,
      canConfirmDelete: null,
    },
    this.languageUKMock,
    this.languageUSMock,
  ] as Language[];

  toolGroupFullDetails = () => {
    const resource = new Resource();
    resource.id = 13;
    resource.name = 'Test Resource';

    return ({
      id: 8,
      'suggestions-weight': '3.0',
      name: 'Test Tool Group',
      'rules-country': [
        {
          id: 1,
          'negative-rule': false,
          'tool-group': {
            id: 8,
          },
          countries: [this.countryUKMock.code, this.countryUSMock.code],
        },
      ],
      'rules-language': [
        {
          id: 2,
          'negative-rule': true,
          'tool-group': {
            id: 8,
          },
          languages: [this.languageUKMock.code, this.languageUSMock.code],
        },
      ],
      'rules-praxis': [
        {
          id: 3,
          'negative-rule': false,
          'tool-group': {
            id: 8,
          },
          confidence: ['1', '2'],
          openness: ['3'],
        },
      ],
      tools: [
        {
          id: 17,
          'suggestions-weight': '12',
          suggestionsWeight: '12',
          tool: {
            ...resource,
            id: 15,
            name: 'Resource Name',
          },
          'tool-group': {
            id: 8,
          },
        },
      ],
    } as unknown) as ToolGroup;
  };
}
