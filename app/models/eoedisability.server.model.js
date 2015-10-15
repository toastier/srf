var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eoeDisabilityModel = new Schema({
    opening: {
        type: Schema.Types.ObjectId,
        ref: 'Opening'
    },
    disability: {
        type: String, enum: ['y', 'n', 'd']
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
},
    {
        collection: 'eoeDisability'
    }
);

var modelName = 'EoeDisability';

module.exports = mongoose.model(modelName, eoeDisabilityModel);

