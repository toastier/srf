
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var positionModel = new Schema({
        jobCode: String, // FUTURE? if there is a related HR code
        positionName: String,
        details: String,
        dateRequest: Date,
        datePost: {type: Date, default: Date.now},
        dateStart: Date,
        dateClose: Date,
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
        }
    }
);

var modelName = 'Position';

module.exports = mongoose.model(modelName, positionModel);
console.log('Model: ',modelName);

