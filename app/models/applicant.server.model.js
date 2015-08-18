
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
        dateCreated: {
            type: Date,
            default: Date.now
        }
    }
);

var modelName = 'Applicant';

module.exports = mongoose.model(modelName, applicantModel);
console.log('Model: ',modelName);

