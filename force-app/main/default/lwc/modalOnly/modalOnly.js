import { LightningElement,api,track } from 'lwc';
import createContactRecord from '@salesforce/apex/createContact.createContactRecord';
export default class ModalOnly extends LightningElement {
    @api recordId;
   isModalOpen = false;
   @track fields = [];
   @track firstName;
   @track lastName;
    handleClick(event)
    {
        let nm = event.target.name;
        if(nm=="createRecord")
        {
            this.isModalOpen=true;
        }
        else if(nm=="cancel")
        {
            this.isModalOpen=false;
        }
        else if(nm=="save")
        {
           this.createContact();
           this.isModalOpen = false;
        }
      
        
    }
    handleChange(event)
    {
        let nm = event.target.name;
        if(nm=="fName")
        {
            this.firstName = event.target.value;
            this.fields[0]=this.firstName;
        }

        else if(nm=="lName")
        {
            this.lastName = event.target.value;
            this.fields[1]=this.lastName;
        }
    }
    createContact(event)
    {
        createContactRecord({flds:this.fields})
    }
}