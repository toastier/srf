/**
 * Created by toastie on 1/13/16.
 */



db.legacy_tbl_positions.find().forEach(function (position) {
    db.positions.insert({
        "legacy": {
            "positionId" : position.PositionID,
            "documentLink": position.documentLink
        },
        "name" : position.Position ? position.Position : '',
        "details" : position.PositionDetails ? position.PositionDetails : '',
        "dateCreated" : new Date(),
        "dateRequested" : position.PostDate ? new Date(position.PostDate) : '',
        "datePosted" : position.PostDate ? new Date(position.PostDate) : '',
        "dateClose" : position.CloseDate ? new Date(position.PostDate) : '',
        "isActive" : false

    })
});
