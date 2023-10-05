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
    name: 'German (Austrian)',
  },
  {
    code: 'de-CH',
    language: 'German',
    region: 'Switzerland',
    name: 'German (Switzerland)',
  },
  {
    code: 'de-DE',
    language: 'German',
    region: 'Germany',
    name: 'German (Germany)',
  },
  {
    code: 'el-GR',
    language: 'Greek',
    region: 'Greece',
    name: 'Modern Greek',
  },
  {
    code: 'en-US',
    language: 'English',
    region: 'United States',
    name: 'English (United States)',
  },
  {
    code: 'en-GB',
    language: 'English',
    region: 'United Kingdom',
    name: 'English (British)',
  },
  {
    code: 'en-AU',
    language: 'English',
    region: 'Australia',
    name: 'English (Australian)',
  },
  {
    code: 'en-CA',
    language: 'English',
    region: 'Canada',
    name: 'English (Canadian)',
  },
  {
    code: 'en-IE',
    language: 'English',
    region: 'Ireland',
    name: 'English (Irish)',
  },
  {
    code: 'en-IN',
    language: 'English',
    region: 'India',
    name: 'English (Indian)',
  },
  {
    code: 'en-NZ',
    language: 'English',
    region: 'New Zealand',
    name: 'English (New Zealand)',
  },
  {
    code: 'en-ZA',
    language: 'English',
    region: 'South Africa',
    name: 'English (South Africa)',
  },
  {
    code: 'es-ES',
    language: 'Spanish',
    region: 'Spain',
    name: 'Spanish (Spain)',
  },
  {
    code: 'es-AR',
    language: 'Spanish',
    region: 'Argentina',
    name: 'Spanish (Argentine)',
  },
  {
    code: 'es-CL',
    language: 'Spanish',
    region: 'Chile',
    name: 'Spanish (Chilean)',
  },
  {
    code: 'es-CO',
    language: 'Spanish',
    region: 'Columbia',
    name: 'Spanish (Colombian)',
  },
  {
    code: 'es-MX',
    language: 'Spanish',
    region: 'Mexico',
    name: 'Spanish (Mexican)',
  },
  {
    code: 'es-US',
    language: 'Spanish',
    region: 'United States',
    name: 'Spanish (American)',
  },
  {
    code: 'fr-FR',
    language: 'French',
    region: 'France',
    name: 'French (France)',
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
    name: 'French (Belgian)',
  },
  {
    code: 'fr-CA',
    language: 'French',
    region: 'Canada',
    name: 'French (Canadian)',
  },
  {
    code: 'fr-CH',
    language: 'French',
    region: 'Switzerland',
    name: 'French (Switzerland)',
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
    code: 'it-IT',
    language: 'Italian',
    region: 'Italy',
    name: 'Italian (Italy)',
  },
  {
    code: 'it-CH',
    language: 'Italian',
    region: 'Switzerland',
    name: 'Italian (Switzerland)',
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
    name: 'Dutch (The Netherlands)',
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
    code: 'pt-PT',
    language: 'Portugese',
    region: 'Portugal',
    name: 'Portuguese (Portugal)',
  },
  {
    code: 'pt-BR',
    language: 'Portugese',
    region: 'Brazil',
    name: 'Portuguese (Brazil)',
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
