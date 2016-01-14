/**
 * Created by toastie on 1/13/16.
 */

//function cap1st(string) {    var lower = string.toLowerCase();
//    return lower.charAt(0).toUpperCase() + lower.slice(1);
//}


db.legacy_tbl_positions.find().forEach(function (position) {
    db.positions.insert({
        "legacy": {
            "documentLink": position.documentLink
        },
        "positionId" : position.PositionID,
        "name" : position.Position ? position.Position : '',
        "details" : position.PositionDetails ? position.PositionDetails : '',
        "dateCreated" : new Date(),
        "dateRequested" : position.PostDate ? new Date(position.PostDate) : '',
        "datePosted" : position.PostDate ? new Date(position.PostDate) : '',
        "dateClose" : position.CloseDate ? new Date(position.PostDate) : '',
        "isActive" : false

    })
});
