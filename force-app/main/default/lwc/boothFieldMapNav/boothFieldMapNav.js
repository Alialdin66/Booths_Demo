import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getHarvestFields from '@salesforce/apex/BoothFieldController.getBoothFields';
import FIELD_ID from '@salesforce/schema/Booths__c.Id';
import FIELD_NAME from '@salesforce/schema/Booths__c.Name';
// import FIELD_CROP from '@salesforce/schema/Harvest_Field__c.Crop__c';
// import FIELD_SIZE from '@salesforce/schema/Harvest_Field__c.Size__c';
import FIELD_STATUS from '@salesforce/schema/Booths__c.Status__c';
// import FIELD_YIELD from '@salesforce/schema/Harvest_Field__c.Yield__c';
import FIELD_MAP_ID from '@salesforce/schema/Booths__c.Map_Id__c';
// import FIELD_IRRIGATION from '@salesforce/schema/Harvest_Field__c.Irrigation__c';

const fields = [
    FIELD_ID,
    FIELD_NAME,
    // FIELD_CROP,
    FIELD_STATUS,
    FIELD_MAP_ID,
    // FIELD_IRRIGATION
];

export default class BoothFieldMapNav extends NavigationMixin(
    LightningElement
) {
    @api recordId;
    error;
    harvestField;

    @wire(getRecord, {
        recordId: '$recordId',
        fields
    })
    wiredRecord({ error, data }) {
        if (error) {
            this.error = error;
            this.harvestField = undefined;
        } else if (data) {
            this.harvestField = data;
            this.error = undefined;
            this.resetMap();
        }
    }

    @wire(getHarvestFields) wiredHarvestFields;

    handleMapClicked(event) {
        const fieldId = event.target.classList.value;
        if (fieldId && fieldId.substring(0, 5) === 'field') {
            const mapId = fieldId.substring(5);
            this.wiredHarvestFields.data.forEach((field) => {
                if (field.Map_Id__c === mapId) {
                    this[NavigationMixin.Navigate]({
                        type: 'standard__recordPage',
                        attributes: {
                            actionName: 'view',
                            recordId: field.Id
                        }
                    });
                }
            });
        }
    }

    renderField() {
        const field = this.harvestField;
        const fieldEl = this.template.querySelector(
            '.field' + getFieldValue(field, FIELD_MAP_ID)
        );
        if (fieldEl) {
            let color = '#719344';
            if (getFieldValue(field, FIELD_STATUS) === 'Available') {
                color = 'green';
            } else if (getFieldValue(field, FIELD_STATUS) === 'Rent') {
                color = 'red';
            }
            fieldEl.style.fill = color;
        }

        this.template
            .querySelector('.svg-wrapper')
            .classList.remove('slds-hide');
    }

    resetMap() {
        let fieldEl;
        let dropEl;
        let labelEl;
        for (let i = 0; i < 20; i++) {
            fieldEl = this.template.querySelector('.field' + (i + 1));
            if (fieldEl) {
                fieldEl.style.fill = '#DDDDDD';
            }
            dropEl = this.template.querySelector('.drop' + (i + 1));
            if (dropEl) {
                dropEl.style.display = 'none';
            }
            labelEl = this.template.querySelector('.label' + (i + 1));
            if (labelEl) {
                labelEl.style.display = 'none';
            }
        }
        this.renderField();
    }
}
