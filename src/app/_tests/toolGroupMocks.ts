import { LanguageBCP47 } from "../service/languages-bcp47-tag.service";
import { Resource } from "../models/resource";
import { CountriesType, ToolGroup } from "../models/tool-group";

export class ToolGroupMocks {

  languageUKMock = {
    code: 'en-GB',
    language: 'English',
    region: 'United Kingdom',
    name: 'English (British)',
  } as LanguageBCP47;

  languageUSMock = {
    code: 'en-US',
    language: 'English',
    region: 'United States of America',
    name: 'English (American)',
  } as LanguageBCP47;

  countryUKMock = {
    code: 'GB',
    name: 'United Kingdom',
    native: 'United Kingdom',
    phone: [44],
    continent: 'EU',
    capital: 'London',
    currency: ['GBP'],
    languages: ['en']
  } as CountriesType;

  countryUSMock = {
    code: 'US',
    name: 'United States',
    native: 'United States',
    phone: [1],
    continent: 'NA',
    capital: 'Washington D.C.',
    currency: ['USD', 'USN', 'USS'],
    languages: ['en']
  } as CountriesType;


  toolGroupFullDetails = () => {
    const resource = new Resource();
    resource.id = 13;
    resource.name = 'Test Resource';

    return {
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
        }
      ],
      'rules-language': [
        {
          id: 2,
          'negative-rule': true,
          'tool-group': {
            id: 8,
          },
          languages: [this.languageUKMock.code, this.languageUSMock.code],
        }
      ],
      'rules-praxis': [
        {
          id: 3,
          'negative-rule': false,
          'tool-group': {
            id: 8,
          },
          confidence: ['1','2'],
          openness: ['3'],
        }
      ],
      tools: [
        {
          id: 17,
          'suggestions-weight': '12',
          suggestionsWeight: '12',
          tool: {
            ...resource,
            id: 15,
            name: 'Resource Name'
          },
          'tool-group': {
            id: 8,
          },
        }
      ],
    } as unknown as ToolGroup;
  }
}
