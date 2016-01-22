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

db.legacy_tbl_CandidateInformation.find().forEach(function (candidate) {

    db.applicants.insert({
        "legacy": candidate,
        "name": { "firstName" : cap1st(candidate.FName),
            "lastName" : cap1st(candidate.LName)
        },
        "applicantPositions": [{
            positionName: candidate.CurrentPosition,
            institution: {
                institutionName : candidate.CurrentInstitution
            }
        }],
        "credentials" : candidate.Credentials ? parseCredentials(candidate.Credentials) : []
    });





  /*   applicantPositions: [{
        positionName: {type: String},

        credentials: [{
        credential: {type: String},
        note: {type: String},
        institution: {type: String},
        year: {type: Number, min: 1920, max: 2030}
    }],
        focalAreas: [{
        focalArea: {type: String}
    }],
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