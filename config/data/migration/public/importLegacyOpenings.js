/**
 * Created by toastie on 1/13/16.
 */

// Position, successful Application, filled, to be filled with additional script

db.legacy_tbl_positions.find().forEach(function (opening) {
    db.openings.insert({
        "legacy": {
            "positionId" : opening.PositionID
        },
        "name" : opening.Position ? opening.Position : '',
        "details" : opening.PositionDetails || '',
        "dateCreated" : new Date(),
        "dateRequested" : opening.PostDate ? new Date(opening.PostDate) : '',
        "datePosted" : opening.PostDate ? new Date(opening.PostDate) : '',
        "dateStart" : opening.PostDate ? new Date(opening.PostDate) : '',
        "dateClose" : opening.CloseDate ? new Date(opening.PostDate) : '',
        "isActive" : false,
        "position" : getPosition(opening.PositionID),
        "postingLink": [{
            source: "legacy",
            "url": opening.documentLink
        }]
    })
});


/**
 * Created by toastie on 1/14/16.
 */
//var positions = []
//
//var results = db.positions.find({"legacy" : {$exists : true} })
//
//var docArray = results.toArray();
//
//for (i = 0; i < docArray.length; i++) {
//    positions.push({"positionId" : documentArray[i]._id,
//        "legacyPositionId" : documentArray[i].legacy.positionId});
//}
//
//
//var result = db.positions.findOne({"legacy.positionId": opening.PositionID}, {"_id"})]


function getPosition(legacyId) {
    return db.positions.findOne({"legacy.positionId": legacyId},  {"_id" : 1})._id;
}


