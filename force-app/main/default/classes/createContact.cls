public with sharing class createContact {
    @AuraEnabled(cacheable=true)
    public static void createContactRecord(List<String> flds){
        try {
            for(String s:flds)
            {
                System.debug('value'+s);
            }

            List<Contact> c = new List<Contact>();
            Contact con = new Contact();
            con.firstName = flds[0];
            con.lastName = flds[1];
            c.add(con);
            System.debug(con);
            insert c;
            
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
