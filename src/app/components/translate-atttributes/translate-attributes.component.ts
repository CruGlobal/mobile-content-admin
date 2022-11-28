import { Component, Input, OnInit } from '@angular/core';
import { Resource } from '../../models/resource';
import { ResourceType } from '../../models/resource-type';
import { System } from '../../models/system';
import { AttributeTranslation } from '../../models/attribute-translation';
import { ResourceService } from '../../service/resource/resource.service';
import { SystemService } from '../../service/system.service';
import { ResourceTypeService } from '../../service/resource-type.service';
import { AttributeTranslationService } from '../../service/attribute-translation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'admin-translate-attributes',
  templateUrl: './translate-attributes.component.html',
  styleUrls: ['./translate-attributes.component.css']
})


export class TranslateAttributesComponent implements OnInit {
  @Input() resource: Resource;
  resourceTypes: ResourceType[];
  systems: System[];
  saving: Boolean = false;
  errorMessage: string;
  multipleActionsResults: {
    text: String
    type: String
  }[] = []

  constructor(
    protected resourceService: ResourceService,
    protected systemService: SystemService,
    protected resourceTypeService: ResourceTypeService,
    protected activeModal: NgbActiveModal,
    protected attributeTranslationService: AttributeTranslationService
  ) {}

    ngOnInit(): void {
        this.loadAttributes()
    }

    loadAttributes(): void {
        this.attributeTranslationService
        .getAttributes(this.resource.id)
        .then((res) => {
            this.resource = res

        })
    }

    multipleActions(): void {

        const localAttributes = new Map();
        const remoteAttributes = new Map();

        this.resource['translated-attributes'].forEach((attr) => {
            localAttributes.set(attr.id, attr)
        });

        interface IPromises {
            type: String
            id: number
            data: AttributeTranslation
        }
        const promises: IPromises[] = [];

        this.attributeTranslationService
        .getAttributes(this.resource.id)
        .then(async (res) => {
            try {
                this.errorMessage = ''
                this.multipleActionsResults = []
                this.saving = true;

                console.log('this.resource', this.resource['translated-attributes'])
                console.log('res[translated-attributes]', res['translated-attributes'])

                res['translated-attributes'].forEach((attr) => {
                    remoteAttributes.set(attr.id, attr)
                })

                console.log('Delete checks - start')
                // Check for local deleted items
                remoteAttributes.forEach((attr) => {
                    const localVersion = localAttributes.get(attr.id);
                    if (!localVersion) {
                        promises.push({type: 'delete', id: attr.key, data: attr})
                    }
                })
                console.log('Delete checks - complete')

                console.log('Update & Create checks - start')
                localAttributes.forEach((attr) => {
                    const remoteVersion = remoteAttributes.get(attr.id);

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
                            promises.push({type: 'update', id: attr.key, data: attr})
                        }
                    } else {
                        console.log('attr.key', attr.key)
                        // New Items
                        if (!attr.key) {
                            throw new Error('Please ensure all Keys have a value.')
                        }
                        if (!attr['onesky-phrase-id']) {
                            throw new Error('Please ensure all Onesky Phase IDs have a value.')
                        }

                        promises.push({type: 'create', id: attr.key, data: attr})
                    }

                    // Ensure keys are unique
                    localAttributes.forEach((attribute) => {
                        if (attr.id === attribute.id) { return }
                        if (attr.key === attribute.key) { throw new Error('2 or more keys are the same. Please make keys are unique.') }
                    })
                })
                console.log('Update & Create checks - complete')

                console.log('promises', promises)

                // Sort promises
                // 1. delete items first
                // 2. update items second
                // 3. create items last
                promises.sort((a, b) => {
                    if (b.type === 'delete') { return 1 }
                    if (a.type === 'delete') { return -1 }

                    if (a.type === 'create' && b.type === 'create') { return -1 }
                    if (a.type === 'create') { return 1 }
                    if (b.type === 'create') { return -1 }
                })


                let hasError = false
                const errors = []

                // Need to await for this
                const sendPromises = new Promise(async (resolve, reject) => {
                    console.log('Start Promises')
                    for (const promise of promises) {
                        console.log('promise.data', promise.data)
                        if (promise.type === 'delete') {
                            await this.attributeTranslationService
                            .delete(promise.data)
                            .then(() => {

                                this.multipleActionsResults.push({
                                    type: 'success',
                                    text: `Successfully deleted attribute ${promise.id}`
                                })
                            })
                            .catch(() => {
                                hasError = true;

                                this.multipleActionsResults.push({
                                    type: 'danger',
                                    text: `Error while deleting attribute ${promise.id}`
                                })
                            });
                        } else if (promise.type === 'update') {
                            await this.attributeTranslationService
                            .update(promise.data)
                            .then(() => {
                                this.multipleActionsResults.push({
                                    type: 'success',
                                    text: `Successfully updated attribute ${promise.id}`
                                })
                            })
                            .catch(() => {
                                hasError = true;

                                this.multipleActionsResults.push({
                                    type: 'danger',
                                    text: `Error while updating attribute ${promise.id}`
                                })
                            });
                        } else if (promise.type === 'create') {
                            await this.attributeTranslationService
                            .create(this.resource.id, promise.data)
                            .then(() => {
                                this.multipleActionsResults.push({
                                    type: 'success',
                                    text: `Successfully created attribute ${promise.id}`
                                })
                            })
                            .catch(() => {
                                hasError = true;

                                this.multipleActionsResults.push({
                                    type: 'danger',
                                    text: `Error while creating attribute ${promise.id}`
                                })
                            });
                        }
                    }
                    console.log('End Promises', hasError)
                    console.log('errors', errors)

                    if (hasError) {
                        reject('Error')
                    } else {
                        resolve('Completed')
                    }
                })

                await Promise.all([sendPromises])
                this.saving = false;
            } catch (err) {
                this.handleError(err.message)
            }
        });
    }

    createAttribute(): void {
        // CHECK 1: Ensure Keys aren't the same
        const generateId = Math.floor(Math.random() * 999999)
        console.log('generateId', generateId)

        const attribute: AttributeTranslation = {
            id: generateId,
            key: '',
            'onesky-phrase-id': '',
            required: false
        }

        this.resource['translated-attributes'].push(attribute)
    }

    updateAttribute(attribute: AttributeTranslation): void {
        console.log('updateAttribute', attribute)
        this.attributeTranslationService
        .update(attribute)
        .then((res) => {
            console.log('successfully saved', res)
            // this.activeModal.close()
        })
        .catch(this.handleError.bind(this));
    }

    removeAttribute(attribute: AttributeTranslation): void {
        console.log('Attribute to be removed', attribute)

        this.resource['translated-attributes'] = this.resource['translated-attributes']
        .filter((i: AttributeTranslation) => {
            return i.id !== attribute.id
        })
    }

    closeEditModal() {
        this.activeModal.dismiss('dismissed');
    }

    protected saveResource(): void {
        this.saving = true;
        console.log('this.resource', this.resource)

        this.resourceService
          .update(this.resource)
          .then(() =>  this.activeModal.close('closed'))
          .catch((error) => this.handleError(error));
    }

    protected handleError(message): void {
        console.log('handleError', message)
        this.saving = false;
        this.errorMessage = message;
    }
}
