import { Component, Input, OnInit } from '@angular/core';
import { Resource } from '../../models/resource';
import { ResourceType } from '../../models/resource-type';
import { System } from '../../models/system';
import {
  AttributeTranslation,
  IAttributeTranslationPromises,
} from '../../models/attribute-translation';
import { AttributeTranslationService } from '../../service/attribute-translation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'admin-translate-attributes',
  templateUrl: './translate-attributes.component.html',
  styleUrls: ['./translate-attributes.component.css'],
})
export class TranslateAttributesComponent implements OnInit {
  @Input() resourceId: Number;
  @Input() resource: Resource;
  resourceTypes: ResourceType[];
  systems: System[];
  saving: Boolean = false;
  errorMessage: string;
  changesMade: Boolean = false;
  multipleActionsError: Boolean = false;
  multipleActionsPromises: IAttributeTranslationPromises[] = [];
  multipleActionsResults: {
    text: String;
    type: String;
  }[] = [];
  multipleActionsLocalAttributes = new Map<Number, any>();
  multipleActionsRemoteAttributes = new Map<Number, any>();

  constructor(
    protected attributeTranslationService: AttributeTranslationService,
    protected activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.loadAttributes();
  }

  loadAttributes(): void {
    this.attributeTranslationService
      .getAttributes(this.resourceId)
      .then((res) => {
        // Sort attributes base on their keys
        res['translated-attributes'] = res['translated-attributes'].sort((a,b) => {
          return a.key.toLowerCase().localeCompare(b.key.toLowerCase());
        })
        this.resource = res;
      });

  }

  async checkRemoteResourceForDifferences(
    remoteResource: Resource,
  ): Promise<{ successful: Boolean; message: string }> {
    try {
      this.resource['translated-attributes'].forEach((attr) => {
        this.multipleActionsLocalAttributes.set(attr.id, attr);
      });

      console.log('this.resource', this.resource['translated-attributes']);
      console.log(
        'res[translated-attributes]',
        remoteResource['translated-attributes'],
      );

      remoteResource['translated-attributes'].forEach((attr) => {
        this.multipleActionsRemoteAttributes.set(attr.id, attr);
      });

      console.log('Delete checks - start');
      // Check for local deleted items
      this.multipleActionsRemoteAttributes.forEach((attr) => {
        const localVersion = this.multipleActionsLocalAttributes.get(attr.id);
        if (!localVersion) {
          this.multipleActionsPromises.push({
            type: 'delete',
            id: attr.key,
            data: attr,
          });
        }
      });

      console.log('Delete checks - complete');

      console.log('Update & Create checks - start');
      this.multipleActionsLocalAttributes.forEach((attr) => {
        const remoteVersion = this.multipleActionsRemoteAttributes.get(attr.id);

        // Can I find this ID in remoteAttributes
        if (remoteVersion) {
          // Check to ensure all data is the same
          let needsToBeUpdated = false;

          if (remoteVersion.key !== attr.key) {
            needsToBeUpdated = true;
          }
          if (remoteVersion['onesky-phrase-id'] !== attr['onesky-phrase-id']) {
            needsToBeUpdated = true;
          }
          if (remoteVersion.required !== attr.required) {
            needsToBeUpdated = true;
          }

          if (needsToBeUpdated) {
            this.multipleActionsPromises.push({
              type: 'update',
              id: attr.key,
              data: attr,
            });
          }
        } else {
          console.log('attr.key', attr.key);
          // New Items
          if (!attr.key) {
            throw new Error('Please ensure all Keys have a value.');
          }
          if (!attr['onesky-phrase-id']) {
            throw new Error('Please ensure all Onesky Phase IDs have a value.');
          }

          this.multipleActionsPromises.push({
            type: 'create',
            id: attr.key,
            data: attr,
          });
        }

        // Ensure keys are unique
        this.multipleActionsLocalAttributes.forEach((attribute) => {
          if (attr.id === attribute.id) {
            return;
          }
          if (attr.key === attribute.key) {
            throw new Error(
              '2 or more keys are the same. Please make sure all keys are unique.',
            );
          }
        });
      });
      console.log('Update & Create checks - complete');

      console.log('promises', this.multipleActionsPromises);
      return {
        successful: true,
        message: 'Successful',
      };
    } catch (err) {
      console.log('ERR', err);
      return {
        successful: false,
        message: err.message,
      };
    }
  }

  multipleActions(): void {
    this.multipleActionsLocalAttributes.clear();
    this.multipleActionsRemoteAttributes.clear();
    console.log('multipleActionsFunc');

    this.attributeTranslationService
      .getAttributes(this.resource.id)
      .then(async (res) => {
        try {
          this.errorMessage = '';
          this.multipleActionsError = false;
          this.multipleActionsResults = [];
          this.saving = true;
          this.multipleActionsPromises = [];

          const checkDifferences = await this.checkRemoteResourceForDifferences(
            res,
          );
          if (!checkDifferences.successful) {
            throw new Error(checkDifferences.message);
          }

          // Sort promises
          await this.mulitipleActionSortPromises();

          // Need to await for this
          const sendPromises = new Promise(async (resolve, reject) => {
            console.log('Start Promises');
            for (const promise of this.multipleActionsPromises) {
              console.log('promise.data', promise.data);
              if (promise.type === 'delete') {
                await this.mulitipleActionDelete(promise);
              } else if (promise.type === 'update') {
                await this.mulitipleActionUpdate(promise);
              } else if (promise.type === 'create') {
                await this.mulitipleActionCreate(promise);
              }
            }
            console.log('Had Error?', this.multipleActionsError);

            if (this.multipleActionsError) {
              reject('Error');
            } else {
              resolve('Completed');
            }
          });

          await Promise.all([sendPromises]);
          this.saving = false;
          setTimeout(() => this.closeEditModal(), 2000);
        } catch (err) {
          this.handleError(err.message);
        }
      });
  }

  mulitipleActionSortPromises(): void {
    // Sort promises
    // 1. delete items first ()
    // 2. update items second
    // 3. create items last
    this.multipleActionsPromises.sort((a, b) => {
      if (b.type === 'delete') {
        return 1;
      }
      if (a.type === 'delete') {
        return -1;
      }
      if (a.type === 'create') {
        return 1;
      }
      if (b.type === 'create') {
        return -1;
      }
      if (a.type === b.type) {
        return 0;
      }
      return 0
    });
  }

  async mulitipleActionDelete(promise: IAttributeTranslationPromises): Promise<Boolean> {
    console.log('mulitipleActionDelete', 'Start');
    await this.attributeTranslationService
      .delete(promise.data)
      .then(() => {
        this.multipleActionsResults.push({
          type: 'success',
          text: `Successfully deleted attribute ${promise.id}`,
        });
      })
      .catch(() => {
        this.multipleActionsError = true;

        this.multipleActionsResults.push({
          type: 'danger',
          text: `Error while deleting attribute ${promise.id}`,
        });
      });
    console.log('mulitipleActionDelete', 'End');
    return true;
  }

  async mulitipleActionUpdate(promise: IAttributeTranslationPromises): Promise<Boolean> {
    console.log('mulitipleActionUpdate', 'Start');
    await this.attributeTranslationService
      .update(promise.data)
      .then(() => {
        this.multipleActionsResults.push({
          type: 'success',
          text: `Successfully updated attribute ${promise.id}`,
        });
      })
      .catch(() => {
        this.multipleActionsError = true;

        this.multipleActionsResults.push({
          type: 'danger',
          text: `Error while updating attribute ${promise.id}`,
        });
      });
    console.log('mulitipleActionUpdate', 'End');
    return true;
  }

  async mulitipleActionCreate(promise: IAttributeTranslationPromises): Promise<Boolean> {
    console.log('mulitipleActionCreate', 'Start');
    await this.attributeTranslationService
      .create(this.resource.id, promise.data)
      .then(() => {
        this.multipleActionsResults.push({
          type: 'success',
          text: `Successfully created attribute ${promise.id}`,
        });
      })
      .catch(() => {
        this.multipleActionsError = true;

        this.multipleActionsResults.push({
          type: 'danger',
          text: `Error while creating attribute ${promise.id}`,
        });
      });
    console.log('mulitipleActionCreate', 'End');
    return true;
  }

  createAttribute(): void {
    // CHECK 1: Ensure Keys aren't the same
    const generateId = Math.floor(Math.random() * 999999);
    console.log('generateId', generateId);
    this.changeMade();

    const attribute: AttributeTranslation = {
      id: generateId,
      key: '',
      'onesky-phrase-id': '',
      required: false,
    };

    this.resource['translated-attributes'].push(attribute);
  }

  removeAttribute(attribute: AttributeTranslation): void {
    console.log('Attribute to be removed', attribute);
    this.changeMade();

    this.resource['translated-attributes'] = this.resource[
      'translated-attributes'
    ].filter((i: AttributeTranslation) => {
      return i.id !== attribute.id;
    });
  }

  closeEditModal() {
    this.activeModal.dismiss('dismissed');
  }

  changeMade(): void {
    this.changesMade = true;
  }

  protected handleError(message): void {
    console.log('handleError', message);
    this.saving = false;
    this.errorMessage = message;
  }
}
