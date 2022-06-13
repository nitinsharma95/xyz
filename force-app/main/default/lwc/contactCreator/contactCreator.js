import { LightningElement } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import objApi from '@salesforce/schema/Contact';
import firstName from '@salesforce/schema/Contact.FirstName';
import lastName from '@salesforce/schema/Contact.LastName';
import email from '@salesforce/schema/Contact.Email';

export default class ContactCreator extends LightningElement {
    objApiName = objApi;
    fields =[firstName,lastName,email];
    handleSuccess(event)
    {
        const toastEvent = new ShowToastEvent({
            title: "Account created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }
}