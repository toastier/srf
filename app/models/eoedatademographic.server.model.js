var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eoeDataDemographicModel = new Schema({
    opening: {
        type: Schema.ObjectId,
        ref: 'Opening'
    },
    gender: {
        type: String
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
    // User is what has been causing the ObjectId cast error on create (2015-09-04)
    //user: {
    //    displayName: {
    //        type: String,
    //        default: 'Doris DuSon'
    //    }
    //}
  },
    {
        collection: 'eoeDataDemographic'
    }
);

//eoeDataDemographicModel.virtual('race.multiple').applyGetters()
eoeDataDemographicModel.virtual('race.multiple').get(function () {
    return ((race.white + race.black + race.pacific + race.native) >= 1);
})

var modelName = 'EoeDataDemographic';

module.exports = mongoose.model(modelName, eoeDataDemographicModel);

