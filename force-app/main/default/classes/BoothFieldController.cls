/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 08-21-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
// public with sharing class BoothFieldController {
//     public BoothFieldController() {

//     }
// }

global with sharing class BoothFieldController {
    @AuraEnabled(cacheable=true)
    public static List<Booths__c> getBoothFields() {
        return [
            SELECT
                Id,
                Name,
                Status__c,
                Map_Id__c
            FROM Booths__c
            WITH SECURITY_ENFORCED
            LIMIT 20
        ];
    }
}
