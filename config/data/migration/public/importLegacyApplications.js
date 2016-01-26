/**
 * Created by toastie on 1/13/16.
 */



function cap1st(string) {
    var lower = string.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

//function parseCredentials(credentials) {
//    var oldCredentials = credentials.split(',');
//    var newCredentials = [];
//    oldCredentials.forEach(function(credential) {
//        newCredentials.push({"credential" : credential.trim()})
//    })
//    return newCredentials;
//}
//
//function parseFocals(focals) {
//    var oldFocals = focals.split(/and|,/);
//    var newFocals = [];
//    oldFocals.forEach(function (focal) {
//        newFocals.push({"focalArea": focal.trim()})
//    })
//    return newFocals;
//}
//
//function parsePhoneNumbers(candidate) {
//    var newPhones = [];
//    if (candidate.Phone1) {
//        newPhones.push({"phoneNumber" : candidate.Phone1, "primary" : newPhones.length == 0 ? true : false})
//    };
//    if (candidate.Phone2) {
//        newPhones.push({"phoneNumber" : candidate.Phone2, "primary" : newPhones.length == 0 ? true : false})
//    };
//    if (candidate.Phone3) {
//        newPhones.push({"phoneNumber" : candidate.Phone3, "primary" : newPhones.length == 0 ? true : false})
//    };
//    return newPhones;
//}

function getApplicant(candidateId) {
    var doc = db.applicants.findOne({"legacy.CandID" : candidateId});
    var applicantId = doc._id;
    return applicantId;
}

function getOpening(candidateId) {
    var applicantId = getApplicant(candidateId);
    var legacyCursor = db.applicants.findOne({"_id":applicantId},{"_id":0,"legacy":1});
    var legacyPositionId = (legacyCursor.legacy.PositionID).toString();
    print('legacyPositionId: ', legacyPositionId);
    var opening = db.openings.findOne({"legacy.positionId":legacyPositionId}, {'_id':1});
    return opening._id;

}


function getNotes(candidateId) {
    var legacyCursor = db.legacy_tblNotes.find({"CandID":candidateId}) || [];
    print(legacyCursor);
    applicationNotes = [];
    legacyCursor.forEach(function (note) {
        applicationNotes.push(note)
    });
    return applicationNotes;
}


function getOnSiteVisit(candidateId) {
    var legacyVisit = db.legacy_tbl_CampusVisits.findOne({"CandID":candidateId}) || null;
    var applicationVisit = legacyVisit ? {
        "complete": true,
        "dateCompleted": new Date(legacyVisit.VisitDate)
    } : null;
    return applicationVisit;
}


function getComments(candidateId) {
    var legacyCursor = db.legacy_tbl_Comments.find({"CandID":candidateId}) || [];
    var applicationComments = [];
    print(legacyCursor);
    legacyCursor.forEach(function (comment) {
        var parsedComment = comment.DateOfComment + ": " + comment.CommenterInitials + ": " + comment.Comment;
        applicationComments.push(parsedComment);
    });
    return applicationComments;
}




db.legacy_tbl_CandidateInformation.find().forEach(function (candidate) {
    var visited = getOnSiteVisit(candidate.CandID);
    db.applications.insert({
        "legacy": {
            "cv" : candidate.LinkToCV || 'unknown',
            "notes" : {
                "applicant": candidate.Notes || 'none',
                "application": getNotes(candidate.CandID)
            }
        },
        "firstName" : cap1st(candidate.FName),
        "lastName" : cap1st(candidate.LName),
        "dateSubmitted" : candidate.DateResumeRecieved,  // [SIC]
        "emailAddress" : candidate.EmailAddress || 'unknown',
        "applicant" : getApplicant(candidate.CandID),
        "opening" : getOpening(candidate.CandID),
        "onSiteVisitPhase": visited,
        "proceedToReview": visited ? true : null,
        "reviewPhase" : {
            "committeeComments" : getComments(candidate.CandID),
            "proceedToPhoneInverview" : visited ? true : null
        },
        //"reviewPhase" : visited ?
        //    {"proceedToPhoneInterview" : true } : null,
        "phoneInterviewPhase" : visited ?
            {"proceedToOnSite" : true } : null
    });
})

