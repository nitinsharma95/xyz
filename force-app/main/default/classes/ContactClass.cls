public class ContactClass {
public static void contactRelationship(List<Contact> con)
{
    Set<Id> idd = new Set<Id>();
    for(Contact c:con)
    {
        
        if(c.Contact_Relationship__c)
        {
          idd.add(c.OwnerId);
        }
    }
    
    List<User> usr = new List<User>([SELECT Name FROM User WHERE ID IN:idd]);
    List<String> str = new List<String>();
    for(User u:usr)
    {
        str.add(u.Name);
    }
    List<Contact_Relationship__c> conRel = [SELECT Name FROM Contact_Relationship__c WHERE Name IN:str];
    List<Contact_Relationship__c> conRelCreate = new List<Contact_Relationship__c>();
   
    System.debug('name' +conRel);
    if(conRel.size()==0)
    {
       
         for(User u:usr) 
            for(Contact c:con) 
       { 
           Contact_Relationship__c cr = new Contact_Relationship__c();
           
           cr.Name=u.Name;
           cr.Contact__c = c.Name;
           conRelCreate.add(cr);
       }
        
    }
    if(conRelCreate.size()>0)
    {
      insert conRelCreate;  
    }
    
 
}
    
    public static void contactRelationshipUpdate(Map<Id,Contact> oldCon, Map<Id,Contact> newCon)
{
    Set<Id> iddOld = new Set<Id>();
    Set<Id> iddNew = new Set<Id>();
    for(Contact c:oldCon.values())
    {
        
        if(c.Contact_Relationship__c)
        {
          iddOld.add(c.OwnerId);
        }
    }
    
    for(Contact c:newCon.values())
    {
        
        if(c.Contact_Relationship__c)
        {
          iddNew.add(c.OwnerId);
        }
    }
    
    List<User> usrOld = new List<User>([SELECT Name FROM User WHERE ID IN:iddOld]);
    List<User> usrNew = new List<User>([SELECT Name FROM User WHERE ID IN:iddNew]);
    List<String> strOld = new List<String>();
    List<String> strNew = new List<String>();
    for(User u:usrOld)
    {
        strOld.add(u.Name);
    }
    
    for(User u:usrNew)
    {
        strNew.add(u.Name);
    }
    List<Contact_Relationship__c> conRel = [SELECT Name FROM Contact_Relationship__c WHERE Name IN:strOld];
    System.debug('name' +conRel);
    if(conRel.size()>0)
    {
       
         for(User u:usrNew) 
             for(Contact_Relationship__c cR:conRel)
             for(Contact c:newCon.values())
             
       { 
           
           cR.Name=u.Name;
           cR.Contact__c = c.Name;
       }
        
    }
   
      update conRel;  
   
    
}
    
    
   public static void contactRelationshipDelete(Map<Id,Contact> oldCon)
       
   {
       List<String> conRelName = new List<String>();
       for(Contact c:oldCon.values())
       {
          conRelName.add(c.Name); 
       }
       List<Contact_Relationship__c> conRel = [SELECT Id, Contact__c FROM Contact_Relationship__c WHERE Contact__c IN:conRelName]; //question id or name
    System.debug(conRel);
    
       
        delete conRel;
    
       
   }
    
    public static void contactRelationshipUnDelete(Map<Id,Contact> oldCon)
        
    {
        unDelete [SELECT Id FROM Contact_Relationship__c WHERE isDeleted=True AND Contact__c IN:oldCon.keySet() ];
    }
}