/**
 * Created by toastie on 1/13/16.
 */



function cap1st(string) {
    var lower = string.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}


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
    var applicationNotes = [];
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
    var applicationComments = "";
    legacyCursor.forEach(function (comment) {
        var commentDate = new Date(comment.DateOfComment);
        var parsedDate = commentDate.getMonth()+1 + "/" + commentDate.getDate() + "/" + (commentDate.getYear() + 1900);
        var parsedComment =  "<strong>" + parsedDate + " (" + comment.CommenterInitials + ")</strong><br/>"  + comment.Comment + "<p></p>";
        applicationComments += parsedComment;
    });
    return applicationComments;
}

function getReferenceChecks(candidateId) {
    var legacyCursor = db.legacy_tbl_RefComments.find({"CandID":candidateId}) || [];
    var applicationRefComments = [];
    legacyCursor.forEach(function (comment) {
        var commentDate = new Date(comment.DateOfCheck);
        var parsedDate = commentDate.getMonth()+1 + "/" + commentDate.getDate() + "/" + (commentDate.getYear() + 1900);
        var parsedComment = "<strong>" + parsedDate + " (" + comment.RefCheckInitials + ")</strong><br/>"  + comment.ReferenceText + "<p></p>";
        applicationRefComments += parsedComment;
    });
    return applicationRefComments;
}

function getEval(candidateId) {
    var legacyCursor = db.legacy_tbl_eval.find({"CandID":candidateId}) || [];
    var evaluations = [];
    legacyCursor.forEach(function (evaluation) {
        evaluations.push(evaluation)
    });
    if (evaluations.length == 0) {
        var legacyCursor = db.legacy_tblCandEval_Nov2010.find({"candID":candidateId}) || [];
        var evaluations = [];
        legacyCursor.forEach(function (evaluation) {
            evaluations.push(evaluation)
        });
    }
    return evaluations;
}

function getQualEval(candidateId) {
    var legacyCursor = db.legacy_tblQualEval.find({"CandID":candidateId}) || [];
    var evaluations = [];
    legacyCursor.forEach(function (evaluation) {
        evaluations.push(evaluation)
    });
    return evaluations;
}


db.legacy_tbl_CandidateInformation.find().forEach(function (candidate) {
    var visited = getOnSiteVisit(candidate.CandID);
    var reviewComments = getComments(candidate.CandID);
    var referenceChecks = getReferenceChecks(candidate.CandID);
    var applicant = getApplicant(candidate.CandID);
    var opening =  getOpening(candidate.CandID);
    var applicationNotes = getNotes(candidate.CandID);
    var evaluations = getEval(candidate.CandID);
    var qualitativeEvaluations = getQualEval(candidate.CandID);

    db.applications.insert({
        "legacy": {
            "cv" : candidate.LinkToCV || 'unknown',
            "notes" : {
                "applicant": candidate.Notes || 'none',
                "application": applicationNotes
            },
            "evaluations" : evaluations,
            "qualitativeEvaluations" : qualitativeEvaluations
        },
        "firstName" : cap1st(candidate.FName),
        "lastName" : cap1st(candidate.LName),
        "dateSubmitted" : candidate.DateResumeRecieved,  // [SIC]
        "emailAddress" : candidate.EmailAddress || 'unknown',
        "applicant" : applicant,
        "opening" : opening,
        "onSiteVisitPhase": visited,
        "proceedToReview": reviewComments ? true : false,
        "reviewPhase" : {
            "referenceChecks" : referenceChecks,
            "committeeComments" : reviewComments,
            "proceedToPhoneInterview" : visited ? true : false
        },
        "phoneInterviewPhase" :  {
            "proceedToOnSite" : visited ? true : false
        }
    });
    print('Inserted for ' + candidate.FName + ' ' + candidate.LName + ' for opening ' + opening);
})

