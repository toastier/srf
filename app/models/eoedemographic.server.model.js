var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eoeDemographicModel = new Schema({
    opening: {
            type: Schema.Types.ObjectId,
            ref: 'Opening'
    },
    gender: {
        type: String, enum: ['f', 'm', 'd']
    },
    ethnicity: {
        type: String, enum: ['h', 'n', 'd']
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
        collection: 'eoe'
    }
);
//    .virtual('race.multiple').get(function () {
//    return ((race.white + race.black + race.pacific + race.native));
//});


var modelName = 'Eoe';

module.exports = mongoose.model(modelName, eoeDemographicModel);

