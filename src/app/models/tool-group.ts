export class ToolGroup {
  id: number;
  name: string;
  suggestedWeight: string;
  'rules-country': CountryRule[];
  'rules-language': LanguageRule[];
  'rules-praxis': any;
  tools: any;
  _attributes: string[];
  _relationships: string[];
  _type: string;
}


export class ToolGroupRule {
  id: number;
  'negative-rule': boolean;
  'tool-group': ToolGroup;
  _attributes: string[];
  _relationships: string[];
  _type: string;
  countries?: string[];
  languages?: string[];
}

export type CountryRule = {
  id: number,
  countries: string[],
  'negative-rule': boolean,
  'tool-group': ToolGroup,
  _attributes: string[];
  _relationships: string[];
  _type: string;
}

export type LanguageRule = {
  id: number,
  languages: string[],
  'negative-rule': boolean,
  'tool-group': ToolGroup,
  _attributes: string[];
  _relationships: string[];
  _type: string;
}


export enum RuleTypeEnum {
  COUNTRY = 'country',
  LANGUAGE = 'language',
  PRAXIS = 'praxis',
}
