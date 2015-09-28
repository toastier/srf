
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var positionModel = new Schema({
        jobCode: String, // FUTURE? if there is a related HR code
        name: {
            type: String,
            required: true
        },
        details: {
            type: String
        },
        dateRequested: {type: Date},
        dateCreated: {
            type: Date,
            default: Date.now
        },
        isActive: {
          type: Boolean,
          default: true
        },
        openings: [{
          type: Schema.ObjectId,
          ref: 'Opening'
        }]
    }
);

var modelName = 'Position';

module.exports = mongoose.model(modelName, positionModel);

