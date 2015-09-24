
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
        datePosted: {
            type: Date,
            default: Date.now
        },
        isActive: {
          type: Boolean,
          default: true
        },
        dateStart: {type: Date},
        dateClose: {type: Date},
        positionLink: [{
            source: {
                type: String, enum: ['DUSON', 'Other']
            },
            url: {
                type: String
            }
        }],
        searchLead: {
            firstName: String,
            lastName: String
        },
        openings: [{
          type: Schema.ObjectId,
          ref: 'Opening'
        }]
    }
);

var modelName = 'Position';

module.exports = mongoose.model(modelName, positionModel);

