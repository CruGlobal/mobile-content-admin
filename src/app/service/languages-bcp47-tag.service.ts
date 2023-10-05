import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';

export type LanguageBCP47 = {
  code: string;
  language: string;
  region: string;
  name: string;
}

@Injectable()
export class LanguageBCP47Service extends AbstractService {
  getLanguages(): LanguageBCP47[] {
    return languages
  }
  getLanguage(code: string): LanguageBCP47 | null {
    return languages.find(language => language.code === code);
  }
}

const languages: LanguageBCP47[] = [
  {
    code: 'ar-SA',
    language: 'Arabic',
    region: 'Saudi Arabia',
    name: 'Arabic (Saudi Arabia)',
  },
  {
    code: 'bn-BD',
    language: 'Bangla',
    region: 'Bangladesh',
    name: 'Bangla (Bangladesh)',
  },
  {
    code: 'bn-IN',
    language: 'Bangla',
    region: 'India',
    name: 'Bangla (India)',
  },
  {
    code: 'cs-CZ',
    language: 'Czech',
    region: 'Czech Republic',
    name: 'Czech (Czech Republic)',
  },
  {
    code: 'da-DK',
    language: 'Danish',
    region: 'Denmark',
    name: 'Danish (Denmark)',
  },
  {
    code: 'de-AT',
    language: 'German',
    region: 'Austria',
    name: 'Austrian German',
  },
  {
    code: 'de-CH',
    language: 'German',
    region: 'Switzerland',
    name: '"Swiss" German',
  },
  {
    code: 'de-DE',
    language: 'German',
    region: 'Germany',
    name: 'Standard German (as spoken in Germany)',
  },
  {
    code: 'el-GR',
    language: 'Greek',
    region: 'Greece',
    name: 'Modern Greek',
  },
  {
    code: 'en-AU',
    language: 'English',
    region: 'Australia',
    name: 'Australian English',
  },
  {
    code: 'en-CA',
    language: 'English',
    region: 'Canada',
    name: 'Canadian English',
  },
  {
    code: 'en-GB',
    language: 'English',
    region: 'United Kingdom',
    name: 'British English',
  },
  {
    code: 'en-IE',
    language: 'English',
    region: 'Ireland',
    name: 'Irish English',
  },
  {
    code: 'en-IN',
    language: 'English',
    region: 'India',
    name: 'Indian English',
  },
  {
    code: 'en-NZ',
    language: 'English',
    region: 'New Zealand',
    name: 'New Zealand English',
  },
  {
    code: 'en-US',
    language: 'English',
    region: 'United States',
    name: 'US English',
  },
  {
    code: 'en-ZA',
    language: 'English',
    region: 'South Africa',
    name: 'English (South Africa)',
  },
  {
    code: 'es-AR',
    language: 'Spanish',
    region: 'Argentina',
    name: 'Argentine Spanish',
  },
  {
    code: 'es-CL',
    language: 'Spanish',
    region: 'Chile',
    name: 'Chilean Spanish',
  },
  {
    code: 'es-CO',
    language: 'Spanish',
    region: 'Columbia',
    name: 'Colombian Spanish',
  },
  {
    code: 'es-ES',
    language: 'Spanish',
    region: 'Spain',
    name: 'Castilian Spanish (as spoken in Central-Northern Spain)',
  },
  {
    code: 'es-MX',
    language: 'Spanish',
    region: 'Mexico',
    name: 'Mexican Spanish',
  },
  {
    code: 'es-US',
    language: 'Spanish',
    region: 'United States',
    name: 'American Spanish',
  },
  {
    code: 'fi-FI',
    language: 'Finnish',
    region: 'Finland',
    name: 'Finnish (Finland)',
  },
  {
    code: 'fr-BE',
    language: 'French',
    region: 'Belgium',
    name: 'Belgian French',
  },
  {
    code: 'fr-CA',
    language: 'French',
    region: 'Canada',
    name: 'Canadian French',
  },
  {
    code: 'fr-CH',
    language: 'French',
    region: 'Switzerland',
    name: '"Swiss" French',
  },
  {
    code: 'fr-FR',
    language: 'French',
    region: 'France',
    name: 'Standard French (especially in France)',
  },
  {
    code: 'he-IL',
    language: 'Hebrew',
    region: 'Israel',
    name: 'Hebrew (Israel)',
  },
  {
    code: 'hi-IN',
    language: 'Hindi',
    region: 'India',
    name: 'Hindi (India)',
  },
  {
    code: 'hu-HU',
    language: 'Hungarian',
    region: 'Hungary',
    name: 'Hungarian (Hungary)',
  },
  {
    code: 'id-ID',
    language: 'Indonesian',
    region: 'Indonesia',
    name: 'Indonesian (Indonesia)',
  },
  {
    code: 'it-CH',
    language: 'Italian',
    region: 'Switzerland',
    name: '"Swiss" Italian',
  },
  {
    code: 'it-IT',
    language: 'Italian',
    region: 'Italy',
    name: 'Standard Italian (as spoken in Italy)',
  },
  {
    code: 'ja-JP',
    language: 'Japanese',
    region: 'Japan',
    name: 'Japanese (Japan)',
  },
  {
    code: 'ko-KR',
    language: 'Korean',
    region: 'Republic of Korea',
    name: 'Korean (Republic of Korea)',
  },
  {
    code: 'nl-BE',
    language: 'Dutch',
    region: 'Belgium',
    name: 'Belgian Dutch',
  },
  {
    code: 'nl-NL',
    language: 'Dutch',
    region: 'The Netherlands',
    name: 'Standard Dutch (as spoken in The Netherlands)',
  },
  {
    code: 'no-NO',
    language: 'Norwegian',
    region: 'Norway',
    name: 'Norwegian (Norway)',
  },
  {
    code: 'pl-PL',
    language: 'Polish',
    region: 'Poland',
    name: 'Polish (Poland)',
  },
  {
    code: 'pt-BR',
    language: 'Portugese',
    region: 'Brazil',
    name: 'Brazilian Portuguese',
  },
  {
    code: 'pt-PT',
    language: 'Portugese',
    region: 'Portugal',
    name: 'European Portuguese (as written and spoken in Portugal)',
  },
  {
    code: 'ro-RO',
    language: 'Romanian',
    region: 'Romania',
    name: 'Romanian (Romania)',
  },
  {
    code: 'ru-RU',
    language: 'Russian',
    region: 'Russian Federation',
    name: 'Russian (Russian Federation)',
  },
  {
    code: 'sk-SK',
    language: 'Slovak',
    region: 'Slovakia',
    name: 'Slovak (Slovakia)',
  },
  {
    code: 'sv-SE',
    language: 'Swedish',
    region: 'Sweden',
    name: 'Swedish (Sweden)',
  },
  {
    code: 'ta-IN',
    language: 'Tamil',
    region: 'India',
    name: 'Indian Tamil',
  },
  {
    code: 'ta-LK',
    language: 'Tamil',
    region: 'Sri',
    name: 'Lanka	Sri Lankan Tamil',
  },
  {
    code: 'th-TH',
    language: 'Thai',
    region: 'Thailand',
    name: 'Thai (Thailand)',
  },
  {
    code: 'tr-TR',
    language: 'Turkish',
    region: 'Turkey',
    name: 'Turkish (Turkey)',
  },
  {
    code: 'zh-CN',
    language: 'Chinese',
    region: 'China',
    name: 'Mainland China, simplified characters',
  },
  {
    code: 'zh-HK',
    language: 'Chinese',
    region: 'Hong Kong',
    name: 'Hong Kong, traditional characters',
  },
  {
    code: 'zh-TW',
    language: 'Chinese',
    region: 'Taiwan',
    name: 'Taiwan, traditional characters',
  }
]
