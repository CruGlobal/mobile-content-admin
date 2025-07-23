import { Country } from 'countries-list';
import { Resource } from './resource';

export class ToolGroup {
  id: number;
  name: string;
  suggestedWeight: string;
  'rules-country': CountryRule[];
  'rules-language': LanguageRule[];
  'rules-praxis': PraxisRule[];
  tools: Tools[];
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
  openness?: string[];
  confidence?: string[];
}

export interface CountryRule {
  id: number;
  countries: string[];
  'negative-rule': boolean;
  'tool-group': ToolGroup;
  _attributes: string[];
  _relationships: string[];
  _type: string;
}

export interface LanguageRule {
  id: number;
  languages: string[];
  'negative-rule': boolean;
  'tool-group': ToolGroup;
  _attributes: string[];
  _relationships: string[];
  _type: string;
}

export interface PraxisRule {
  id: number;
  openness: string[];
  confidence: string[];
  'negative-rule': boolean;
  'tool-group': ToolGroup;
  _attributes: string[];
  _relationships: string[];
  _type: string;
}

export interface Praxis {
  code: string;
  name: string;
}
// Created for HTML pages
export type RuleType = 'country' | 'language' | 'praxis';
export enum RuleTypeEnum {
  COUNTRY = 'country',
  LANGUAGE = 'language',
  PRAXIS = 'praxis',
}

export type PraxisType = 'openness' | 'confidence';
export enum PraxisTypeEnum {
  OPENNESS = 'openness',
  CONFIDENCE = 'confidence',
}

export type CountriesType = Country & { code: string };

export interface Tools {
  id: string;
  suggestionsWeight: string;
  tool: Resource;
  'tool-group': ToolGroup;
  _attributes?: string[];
  _relationships?: string[];
  _type?: string;
}

export type RulesType =
  | (CountryRule & LanguageRule & PraxisRule)
  | (LanguageRule & PraxisRule & CountryRule)
  | (PraxisRule & CountryRule & LanguageRule);
