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

var modelName = 'EoeDataDemographic';

module.exports = mongoose.model(modelName, eoeDataDemographicModel);

