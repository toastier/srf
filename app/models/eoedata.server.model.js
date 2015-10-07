var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eoeDatademographicModel = new Schema({
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
        collection: 'eoeDatademographic'
    }
);

var modelName = 'EoeDatademographic';

module.exports = mongoose.model(modelName, eoeDatademographicModel);

