/**
 * Created by toastie on 1/14/16.
 */
var positions = []

var results = db.positions.find({"legacy" : {$exists : true} })

var docArray = results.toArray();

for (i = 0; i < docArray.length; i++) {
    positions.push({"positionId" : documentArray[i]._id,
        "legacyPositionId" : documentArray[i].legacy.positionId});
}
