public with sharing class contactController {
  @AuraEnabled
  public static void createContact(String fName, String lName) {
    try {
      Contact con = new Contact(FirstName = fName, LastName = lName);
      insert con;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled(cacheable=true)
  public static List<wrapperContact> getContact(String searchKey) {
    List<wrapperContact> contactList = new List<wrapperContact>();
    try {
      String s = '%' + searchKey + '%';
      List<Contact> con = new List<Contact>();
      if (!String.isBlank(searchKey)) {
        con = [SELECT Name, Phone, AccountId FROM Contact WHERE Name LIKE :s];
      }
      for (Contact c : con) {
        wrapperContact wrapper = new wrapperContact(c);
        contactList.add(wrapper);
      }
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
    return contactList;
  }
  public class wrapperContact {
    @AuraEnabled
    public Contact conRecord { get; set; }
    @AuraEnabled
    public Boolean isSelected { get; set; }
    public wrapperContact(Contact c) {
      this.conRecord = c;
      this.isSelected = false;
    }
  }
@AuraEnabled(cacheable=true)
  public static List<Contact> myContacts(Integer page)
  {
    System.debug('page'+page);
    Integer o=1;
    Integer oo;
    if(page==0)
    {
      oo=5;
    }
    else if(page>0)
    {
    oo = page*5;
    }
    List<Contact> con = [SELECT FirstName, LastName , Phone FROM Contact ORDER BY Name LIMIT 5 OFFSET :oo];
    if(con.size()>0)
    {
      return con;
    }
      return NULL;
    
      
    
  }
}