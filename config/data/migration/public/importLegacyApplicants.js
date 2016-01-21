/**
 * Created by toastie on 1/13/16.
 */




function cap1st(string) {    var lower = string.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}


db.legacy_tbl_CandidateInformation.find().forEach(function (candidate) {
    db.applicants.insert({
        "legacy": true,
        "name": { "firstName" : cap1st(candidate.FName), "lastName" : cap1st(candidate.LName) }
    });
})