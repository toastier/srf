/**
 * Created by toastie on 7/27/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var positionModel = new Schema({
    name: {type: String },
    details: {type: String },
    postDate: {type: Date},
    closeDate: {type: Date},
    docLink: {type: String}
});

var modelName = 'Position';

module.exports = mongoose.model(modelName, positionModel);
console.log('Model: ',modelName);

