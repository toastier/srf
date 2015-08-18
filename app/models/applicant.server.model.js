
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var applicantModel = new Schema({
        name: {
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            },
            middleName:     { type: String},
            honorific:      { type: String},
            suffix:         { type: String}
        },
        // this will be a pointer to the Positions schema TODO
        positionAppliedFor: {
            positionName:   { type: String}
        },
        dateCreated: {
            type: Date,
            default: Date.now
        },
        user: {
            displayName: {
                type: String,
                default: 'Doris DuSon'
            }
        }
    }
);

var modelName = 'Applicant';

module.exports = mongoose.model(modelName, applicantModel);
console.log('Model: ',modelName);

