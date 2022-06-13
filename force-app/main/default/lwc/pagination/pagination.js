import { LightningElement,track,wire } from 'lwc';
import myContacts from '@salesforce/apex/contactController.myContacts';
export default class Pagination extends LightningElement {
    contacts;
    @track page =0;
    @track dataLength;
    @track totalPages;
    @track dataPerPage = 5;
    connectedCallback()
    {
        this.getConRecords();
    }
    
    handleNext()
    {
        console.log('hii',this.page);
            this.page++; 
            this.getConRecords();
    
    }
    handlePrevious()
    {
            this.page--;
        this.getConRecords();
        
    }

    getConRecords()
    {
        myContacts({page:this.page})
       .then(result=>{
           if(result)
           {
            this.contacts = result;
            this.dataLength = result.length;
            this.totalPages = Math.ceil(this.dataLength/this.dataPerPage);
           }
       })
       .catch(error=>{
           if(error)
           {
               console.log('Error',error);
           }
       })
    }
}