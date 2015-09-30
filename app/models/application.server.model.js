
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var applicationModel = new Schema({
        applicant: {
            type: Schema.Types.ObjectId,
            ref: 'Applicant'
        },
        position: {
            type: Schema.Types.ObjectId,
            ref: 'Position'
        }
    }
);

var modelName = 'Application';

module.exports = mongoose.model(modelName, applicationModel);
console.log('Model: ',modelName);

