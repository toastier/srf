var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eoeDataDemographicsModel = new Schema({
    openingID: {
        type: String
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
        collection: 'eoeDataDemographics'
    }
);

var modelName = 'EoeDataDemographics';

module.exports = mongoose.model(modelName, eoeDataDemographicsModel);

