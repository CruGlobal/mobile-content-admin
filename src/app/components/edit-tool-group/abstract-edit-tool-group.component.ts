import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { countries, ICountry } from 'countries-list'
import { Input } from '@angular/core';
import { ToolGroup } from '../../models/tool-group';
import { ToolGroupService } from '../../service/tool-group/tool-group.service';
import { LanguageBCP47Service, LanguageBCP47 } from '../../service/languages-bcp47-tag.service';

export type countriesType = (ICountry & {code: string})

export abstract class AbstractEditToolGroupComponent {
  saving = false;
  errorMessage: string;

  @Input() toolGroup: ToolGroup = new ToolGroup();
  @Input() selectedCountries: countriesType[] = [];
  @Input() selectedLanguages: LanguageBCP47[] = [];
  countries: countriesType[];
  languages: LanguageBCP47[];

  protected constructor(
    protected toolGroupService: ToolGroupService,
    protected activeModal: NgbActiveModal,
    protected languageBCP47Service: LanguageBCP47Service,
  ) {}

  init(): void {
    this.countries = Object.entries(countries).map(country => {
      return {
        code: country[0],
        ...country[1]
      } as countriesType
    })
    this.languages = this.languageBCP47Service.getLanguages()
  }

  handleSelectedCountry(event) {
    if (this.isAlreadySelected(this.selectedCountries, event.code)) {
      this.handleError('Already selected Country')
      return
    };
    this.selectedCountries = [...this.selectedCountries, event]
  }

  handleSelectedLanguage(event) {
    if (this.isAlreadySelected(this.selectedLanguages, event.code)) {
      this.handleError('Already selected Language')
      return
    };
    this.selectedLanguages = [...this.selectedLanguages, event]
  }

  isAlreadySelected(dataArray: countriesType[] | LanguageBCP47[], code: string) {
    return dataArray.find(item => item.code === code);
  }

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  protected handleError(message): void {
    this.saving = false;
    this.errorMessage = message;
  }

  protected saveToolGroup(): void {
    this.activeModal.close('closed');
  }
}
