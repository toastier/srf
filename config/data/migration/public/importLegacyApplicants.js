/**
 * Created by toastie on 1/13/16.
 */




function cap1st(string) {
    var lower = string.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function parseCredentials(credentials) {
    var oldCredentials = credentials.split(',');
    var newCredentials = [];
    oldCredentials.forEach(function(credential) {
        newCredentials.push({"credential" : credential.trim()})
    })
    return newCredentials;
}

function parseFocals(focals) {
    var oldFocals = focals.split(/and|,/);
    var newFocals = [];
    oldFocals.forEach(function (focal) {
        newFocals.push({"focalArea": focal.trim()})
    })
    return newFocals;
}

function parsePhoneNumbers(candidate) {
    var newPhones = [];
    if (candidate.Phone1) {
        newPhones.push({"phoneNumber" : candidate.Phone1, "primary" : newPhones.length == 0 ? true : false})
    };
    if (candidate.Phone2) {
        newPhones.push({"phoneNumber" : candidate.Phone2, "primary" : newPhones.length == 0 ? true : false})
    };
    if (candidate.Phone3) {
        newPhones.push({"phoneNumber" : candidate.Phone3, "primary" : newPhones.length == 0 ? true : false})
    };
    return newPhones;
}

db.legacy_tbl_CandidateInformation.find().forEach(function (candidate) {
    db.applicants.insert({
        "legacy": candidate,
        "name": { "firstName" : cap1st(candidate.FName),
            "lastName" : cap1st(candidate.LName)
        },
        "applicantPositions": [{
            positionName: candidate.CurrentPosition || 'not available',
            institution: {
                institutionName : candidate.CurrentInstitution || 'not available'
            }
        }],
        "credentials" : candidate.Credentials ? parseCredentials(candidate.Credentials) : [],
        "focalAreas" : candidate.FocalArea ? parseFocals(candidate.FocalArea) : [],
        "emailAddresses" : candidate.EmailAddress ?
            [{ "emailAddress" : candidate.EmailAddress, "primary" : true}] : [],
        "phoneNumbers" : (candidate.Phone1 || candidate.Phone2 || candidate.Phone3) ?
            parsePhoneNumbers(candidate) : []
    });





  /*   applicantPositions: [{

        focalAreas:
        emailAddresses: [{
        emailAddress: {type: String},
        primary: {type: Boolean},
        note: {type: String}
    }],
        phoneNumbers: [{
        phoneNumber: {type: String},
        type: {type: String},
        note: {type: String},
        primary: {type: Boolean}
    }],
        addresses: [{
        type: {type: String}, //TODO enumList
        address1: {type: String},
        address2: {type: String},
        city: {type: String}, //TODO enumlist
        state: {type: String}, //TODO enumlist
        postalCode: {type: String},
        country: {type: String}, //TODO enumlist
        primary: {type: Boolean}
    }], */
})