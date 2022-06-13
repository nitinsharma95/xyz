public with sharing class allObjectController {
    @AuraEnabled(cacheable=true)
    public static List<DataWrapper> getAllObjects(){
        List<DataWrapper> objList = new List<DataWrapper>();
        for ( Schema.SObjectType o : Schema.getGlobalDescribe().values() ){
            DataWrapper obj = new DataWrapper();
            Schema.DescribeSObjectResult objResult = o.getDescribe();
            obj.objName = objResult.getName();
            obj.objLabel = objResult.getLabel();
            objList.add(obj);
        }     
        return objList;
    }

    @AuraEnabled(cacheable=true)
    public static List<DataWrapper> getAllFields(String name) {
        System.debug('name'+name);
        List<DataWrapper> fieldList = new List<DataWrapper>();
        Schema.SObjectType obj = Schema.getGlobalDescribe().get(name);
        Map<String, Schema.SObjectField> fieldMap = obj.getDescribe().fields.getMap();
            for (Schema.SObjectField field : fieldMap.values()) {
                 System.debug(field.getDescribe().getName());
                 DataWrapper f = new DataWrapper();
                 f.objLabel = field.getDescribe().getLabel();
                 f.objName = field.getDescribe().getName();
                 fieldList.add(f);
             }
             return fieldList;
    }
     @AuraEnabled
    public static List<sObject> getDatatable(String name , List<string> fields) {
        List <sObject> listRecs = new List <sObject>();
        String fieldsToQuery = string.join(fields,',');
        String strSOQL = 'SELECT ' + fieldsToQuery + ' FROM ' + name + ' ORDER BY CreatedDate DESC';
        listRecs = Database.query(strSOQL);
        return listRecs;    
    } 

    public class DataWrapper
    {
        @AuraEnabled
        public String objLabel {get;set;}
        @AuraEnabled
        public String objName {get;set;}
    } 
    
}
