
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var applicationModel = new Schema({
        applicant: {
            type: Schema.Types.ObjectId,
            ref: 'Applicant'
        },
        opening: {
            type: Schema.Types.ObjectId,
            ref: 'Opening'
        }
    }
);

var modelName = 'Application';

module.exports = mongoose.model(modelName, applicationModel);
//console.log('Model: ',modelName);

