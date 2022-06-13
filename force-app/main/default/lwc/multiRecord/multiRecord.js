import { LightningElement , track, wire} from 'lwc';
import getAllObjects from '@salesforce/apex/allObjectController.getAllObjects';
import getAllFields from '@salesforce/apex/allObjectController.getAllFields';
import { deleteRecord } from 'lightning/uiRecordApi';
import getDatatable from '@salesforce/apex/allObjectController.getDatatable';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class AccountPick extends LightningElement {
    @track objList = [];
    @track value;
    @track isModalOpen = false;
    @track selectObject;
    @track lstOptions;
    @track selectedValue;
    @track listRecs;
    @track columns = [];
    @track deleteButton = [];
    @track editObjectValue;
    @track objectRecordId;
    @track isEditForm = false;
    connectedCallback(){
        getAllObjects().then(result => {
            if(result)
            {
                for(var i = 0; i < result.length; i++){
                    const option = {
                        label : result[i].objLabel,
                        value : result[i].objName
                    };
                    this.objList = [...this.objList, option];
                    // JSON.parse = JSON.stringify(this.objList);
                    console.log(' this.objectList #', this.objList);
                }
            }
        })
        .catch(error=>{
          console.log(error);
        })
    }

    getData(){
        
    }

    handleChange(event){
        this.value = event.detail.value;
        console.log('my obj', this.value);
        getAllFields({name:this.value}).then((result)=>{
            if(result)
            {
                console.log('result------->',result)
              this.lstOptions = [];
            //   this.isLoading = true;
            for(var i = 0; i < result.length; i++){
              const option = {
                  label : result[i].objLabel,
                  value : result[i].objName
              };
                 this.lstOptions=[...this.lstOptions, option]    
                 JSON.parse(JSON.stringify(this.lstOptions));
            }
          }
        })
        .catch(error=>{
          console.log('My Error',error);
        })   
    }

    handleClick() {
      console.log(this.value);
      console.log(this.selectedValue);
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.isEditForm = false;
    }
    submitDetails() {
        this.isModalOpen = false;
        this.isEditForm = false;
    }

    handleFetch(event) {
        console.log('selected event.detail.value----->',JSON.parse(JSON.stringify(event.detail.value))); 
        this.selectedValue = event.detail.value;
        //console.log('selected value----->',JSON.parse(JSON.stringify(this.selectedValue))); 
    }

    get isData(){
        return this.listRecs && this.listRecs.length > 0;
    }

    handleSave(){
      this.columns=[];

        for(var i = 0; i< this.selectedValue.length;i++ ){
            const option = {
                label : this.selectedValue[i],
                fieldName : this.selectedValue[i]
            };
               this.columns=[...this.columns, option]
        }
        var colum1 = {

            label: 'Edit',
            
            type: 'button-icon',
            
            initialWidth: 75,
            
            typeAttributes: {
            
            iconName: 'action:edit',
            
            title: 'edit',
            
            variant: 'border-filled',
            
            alternativeText: 'edit'
            
            }
            
            };

            var colum = {

                label: 'Delete',
                
                type: 'button-icon',
                
                initialWidth: 75,
                
                typeAttributes: {
                
                iconName: 'action:delete',
                
                title: 'delete',
                
                variant: 'border-filled',
                
                alternativeText: 'delete'
                
                }
                };

                var colum2 = {

                    label: 'View',
                    
                    type: 'button-icon',
                    
                    initialWidth: 75,
                    
                    typeAttributes: {
                    
                    iconName: 'action:preview',
                    
                    title: 'preview',
                    
                    variant: 'border-filled',
                    
                    alternativeText: 'view'
                    
                    }
                    };
        
            
            
        this.columns = [...this.columns,colum]
        this.columns = [...this.columns,colum1]
         this.columns = [...this.columns,colum2]
        console.log('result>>>>>>',this.columns)
         this.refreshTableData();
    }

    refreshTableData(){
        this.listRecs = [];
        getDatatable({name:this.value,fields:this.selectedValue}).then(result => {
            if(result)
            {
                
                this.listRecs = JSON.parse(JSON.stringify(result));
                console.log('result>>>>>>',result)
                console.log('this.selectedValue.size()',this.selectedValue.length)
        
            } })
            .catch(error=>{
              console.log('Error ##',error);
            })
    }

     handleSubmit() {
        console.log('done');
        this.template.querySelector('lightning-record-edit-form').submit();
        this.isEditForm = false;
     }
     handleSuccess(){
        console.log('done on success')
        this.isModalOpen = false;
        this.refreshTableData();
     }

   handleRowAction(event) {
        console.log('event',JSON.parse(JSON.stringify(event)))
        if(event.detail.action.title == 'delete') {
            console.log('delete');
            this.deleteSelectedRow(event.detail.row.Id);
        }
        else if(event.detail.action.title == 'edit') {
            console.log('edit');
            this.isEditForm = true;
            this.editObjectValue = this.value;
            this.objectRecordId = event.detail.row.Id; 

        }
        else if(event.detail.action.title == 'preview') {
            console.log('preview');
        }
      
 }

 deleteSelectedRow(deleteRow) {
    
    console.log('delete',deleteRow)
    deleteRecord(deleteRow)
            .then(() => {
                let newData = JSON.parse(JSON.stringify(this.listRecs));
                newData = newData.filter(row => row.Id != deleteRow);
                this.listRecs = newData;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                console.log('error',error)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.output.errors[0].message,
                        variant: 'error'
                    })
                );
            });
        
    
    console.log('list ....>>>>>>>',JSON.parse(JSON.stringify(this.listRecs)))
}
openEditForm(editRow) {
    this.isModalOpen = true;
}
    
}