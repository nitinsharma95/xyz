public with sharing class DemoController {
    @AuraEnabled
    public static WrapperData myDemos(String idd, Boolean flg, List<Id> i, String objId){
        try {
            List<String> flds= new List<String>();
            List<String> fldApiName= new List<String>();
            List<sObject> con = new List<sObject>();
            WrapperData wData = new WrapperData();
            Id sampleid = objId; 
            //String obj = sampleid.getSObjectType().getDescribe().getName();
            sObjectType obj = sampleid.getSObjectType();
            System.debug('obj'+obj);
            String fields = '';
            // Schema.FieldSet fieldSetObj = obj.getDescribe().FieldSets.getMap().get('DemoFields');
            // List<Schema.FieldSetMember> fieldSetMembers = fieldSetObj.getFields();
            // for (Schema.FieldSetMember fsm : fieldSetMembers) {
            //     flds.add(fsm.getLabel());
            //     fields +=fsm.getFieldPath()+',';
            // }

            // Map<String, Schema.SObjectType> GlobalDescribeMap = Schema.getGlobalDescribe(); 
            // Schema.SObjectType SObjectTypeObj = GlobalDescribeMap.get('Account');
            Schema.DescribeSObjectResult DescribeSObjectResultObj = obj.getDescribe();
            Schema.FieldSet fieldSetObj = DescribeSObjectResultObj.FieldSets.getMap().get('DemoFields');
            System.debug('fieldSetObj'+fieldSetObj);
            List<Schema.FieldSetMember> fieldSetMembers = fieldSetObj.getFields();
            System.debug('fieldSetMembers'+fieldSetMembers);
            for (Schema.FieldSetMember fsm : fieldSetMembers) { 
                    flds.add(fsm.getLabel());
                    fldApiName.add(fsm.getFieldPath());
                    fields +=fsm.getFieldPath()+',';
                }
            
            // for(Schema.FieldSetMember fld :sObjectType.Demo__c.FieldSets.DemoFields.getFields()) {
            //     flds.add(fld.getLabel());
            //     fields +=fld.getFieldPath()+',';
            //    }
              
              System.debug('flds '+fields.removeEnd(','));
              System.debug('fldApiName'+fldApiName);
             fields = fields.removeEnd(',');
             wData.fldString = flds;
             wData.fldApiName = fldApiName;
            
            
    if(flg)
    {
        String s = 'Select '+fields+' From '+obj+' WHERE Id>= :idd AND Id NOT IN:i  ORDER BY Name ASC,Id ASC LIMIT 200 ';
        //String s = 'Select '+fields+' From '+obj+' LIMIT 20 ';
        System.debug('query'+s);
        con = Database.query(s);
        System.debug('con'+con);
        wData.sobj=con;
        System.debug('wdata'+wData);
    }
    else if(!flg)
    {
        String s = 'SELECT '+fields+' From '+obj+' WHERE Id<= :idd AND Id NOT IN:i  ORDER BY Name DESC, Id DESC LIMIT 200 ';
        con = Database.query(s);
        con.sort();
        wData.sobj=con;
    }
      //return JSON.serialize(wData);
      return wData;
            
        } catch (Exception e) {
            System.debug('erro'+e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
    public class WrapperData
    {
        @AuraEnabled
        public List<sObject> sobj {get;set;}
        @AuraEnabled
        public List<String> fldString{get;set;}
        @AuraEnabled
        public List<String> fldApiName{get;set;}
    }

    
    
}
