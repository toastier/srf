var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eoeDataDemographicModel = new Schema({
    opening: {
        type: Schema.Types.ObjectId,
        ref: 'Opening'
    },
    gender: {
        type: String, enum: ['Female', 'Male', 'Declined']
    },
    ethnicity: {
        hispanic: {
            type: Boolean
        },
        declined: {
            type: Boolean
        }
    },
    race: {
        native: {
            type: Boolean
        },
        black: {
            type: Boolean
        },
        pacific: {
            type: Boolean
        },
        white: {
            type: Boolean
        },
        declined: {
            type: Boolean
        }
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
    //    ,
    //toObject: {
    //    virtuals: true
    //},
    //toJSON: {
    //    virtuals: true
    //}
},
    {
        collection: 'eoeDataDemographic'
    }
);
//    .virtual('race.multiple').get(function () {
//    return ((race.white + race.black + race.pacific + race.native));
//});


var modelName = 'EoeDataDemographic';

module.exports = mongoose.model(modelName, eoeDataDemographicModel);

