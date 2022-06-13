import { LightningElement,api } from 'lwc';

export default class paginationChildChunk extends LightningElement {
    @api rec;
    @api fld;
    values;
    myData;
    connectedCallback()
    {
        console.log("rec",this.rec);
        console.log('fld',this.fld);
        var records = JSON.stringify(this.rec);
        console.log('records',records);

        this.values = this.rec[this.fld];
        console.log('values',this.values);
    }
}