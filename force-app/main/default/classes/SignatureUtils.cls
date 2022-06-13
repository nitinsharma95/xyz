// SingatureUtils.cls
public with sharing class SignatureUtils {
    @AuraEnabled
    public static void saveSignature(string relatedId, string data, string type){
        //No Id No save
        
        if(String.isBlank(relatedId)) return;
 
        if(type == 'Attachment'){
            saveAttachment(relatedId, data);
        }
 
        if(type == 'SFFile'){
            saveSFFile(relatedId,data);
        }
    }
 
    //Save file as Attachment
 
    private static void saveAttachment(string relatedId, string data){
        Attachment att = new Attachment();
        att.Name = 'Singed-'+System.now().getTime()+'.png';
        att.Body = EncodingUtil.base64Decode(data);
        att.ContentType = 'image/png';
        att.ParentId = relatedId;
 
        insert att;
 
    }
 
    private static void saveSFFile(string relatedId, string data){
        ContentVersion cv = new ContentVersion();
        cv.PathOnClient = 'Singed-'+System.now().getTime()+'.png';
        cv.Title = 'Singed-'+System.now().getTime()+'.png';
        cv.VersionData = EncodingUtil.base64Decode(data);
 
        insert cv;
 
 
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [select contentDocumentId from ContentVersion where id=:cv.id].contentDocumentId;
        cdl.LinkedEntityId = relatedId;
        cdl.ShareType = 'V';
 
        insert cdl;
 
    }
}