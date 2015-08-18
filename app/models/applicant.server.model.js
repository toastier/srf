
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var applicantModel = new Schema({
        jobCode: String, // FUTURE? if there is a related HR code
        name: {
            type: String,
            required: true
        },
        details: {
            type: String
        },
        dateRequest: Date,
        datePost: {
            type: Date,
            default: Date.now
        },
        dateStart: Date,
        dateClose: Date,
        applicantLink: [{
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

var modelName = 'Applicant';

module.exports = mongoose.model(modelName, applicantModel);
console.log('Model: ',modelName);

