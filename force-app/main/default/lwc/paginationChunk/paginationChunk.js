import { LightningElement,track,wire,api } from 'lwc';
import myDemos from '@salesforce/apex/DemoController.myDemos';
//import myDemosPrev from '@salesforce/apex/DemoController.myDemosPrev';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {sortOptionsByLabel} from './util.js';
export default class Pagination extends LightningElement {
    @track demos;
    @track page=0;
    @track dataLength;
    @track totalPages;
    @track dataPerPage = 5;
    @track idd;
    @track idd2;
    @track flg=true;
    @track firstId;
    @track fifthsId;
    p5=true;
    prevDiss = true;
    ids=[];
    @api recordId;
    @api fieldSet;
    @api objectName;
    spi=true;
    pho;
    nextEnable = false;
    @track myFields=[];
    ddd;
    @track fieldsApiName=[];
    
    connectedCallback()
    {
        this.getDemoRecords();
        console.log('fieldSet',this.fieldSet);
    }
    handleClick(event)
    {
      let nm = event.target.name;
      this.nextEnable = false;
      if(nm=="prev")
      {
        if(this.page>0)
        {
            this.spi=true;
            this.flg = false;
            this.idd= this.demos[0].Id;
            this.demos=[];
            this.myFields=[];
            this.fieldsApiName=[];
            this.getDemoRecords();
            this.page--;
        }
        else if(this.page==0){
            this.prevDiss = true;
        }
       }

        else if(nm=="nxt")
        {
            this.spi=true;
            this.flg =true;
            this.idd= this.demos[199].Id;
            this.demos=[];
            this.myFields=[];
            this.fieldsApiName=[];
            this.getDemoRecords();
             this.page++;
            if(this.page>0)
            {
                this.prevDiss = false;
            }
            if(this.page<=5)
            {
                this.p5 = true;
            }
            else if(this.page>5)
            {
                this.p5 = false;
            }
        }

        else if(nm=="1")
        {
            console.log('hii one');
            this.flg = true;
            this.idd=this.firstId;
            console.log('idd one',this.idd);
            this.getDemoRecords();
            this.page = 0;
        }

        else if(nm=="5")
        {
            if(this.page>5)
            {
                this.flg = true;
                this.idd=this.fifthId;
                this.getDemoRecords();
                this.page = 5;     
            }
        }
        else if(nm=="sort")
        {
            sortOptionsByLabel(this.demos.Demo_Email__c);
        }
    }

    // get p() {
    //     return this.p5;
    // }
    // set p(value) {
    //       this.p5 = value;
    // }

    getDemoRecords()
    {
        myDemos({idd:this.idd, flg:this.flg, i:this.ids, objId:this.recordId})
       .then(result=>{
           if(result)
           {
               //this.spi = true;
               if(result)
               {
                   console.log('result',result);

                   this.demos = result.sobj;
                   this.myFields = result.fldString;
                   this.fieldsApiName = result.fldApiName;
                   this.spi=false;
                   console.log('myFields',this.myFields);
                   console.log('fieldsApiName',this.fieldsApiName);
            
               }
               else
               {
                 this.nextEnable = true;
                 const evt = new ShowToastEvent({
                     title:"No Records",
                     message:"all records have been fetched",
                     variant:"info"
                     
                 });
                 this.dispatchEvent(evt);
               }
           
        //     this.spi = false;
        //     this.dataLength = result.length;
        //     for(var i=0;i<this.dataLength;i++)
        //     {
        //         this.ids[i]=this.demos[i].Id;
        //         this.pho = this.demos[i].Phone;
        //     }
        //     if(this.page==0)
        //     {
        //         this.firstId = this.demos[0].Id;
        //     }  

        //    else if(this.page==5)
        //     {
        //         this.fifthId = this.demos[5].Id;
        //         console.log('fifths id',this.fifthId);
        //     }  
           }
           
       })
       .catch(error=>{
           if(error)
           {
            this.dispatchEvent(new ShowToastEvent({
                title:'error',
                message:error.body.message,
                variant:'error'
            }))
           }
       })
    }

    // getDemoRecordsPrev()
    // {
    //     myDemosPrev({idd:this.idd})
    //     .then(result=>{
    //         if(result)
    //         {
    //          this.demos =JSON.parse(JSON.stringify(result));
    //          this.dataLength = result.length;
    //         }
    //     })
    //     .catch(error=>{
    //         if(error)
    //         {
         
    //          this.dispatchEvent(new ShowToastEvent({
    //              title:'error',
    //              message:error.body.message,
    //              variant:'error'
    //          }))
    //         }
    //     })  
    // }
}