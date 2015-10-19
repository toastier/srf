var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var eoeVeteranModel = new Schema({
    opening: {
        type: Schema.Types.ObjectId,
        ref: 'Opening'
    },
    veteran: {
        type: String, enum: ['yes-id', 'yes-not-id', 'no']
    },
    vetClass: {
        disabled: {
            type: Boolean
        },
        recent: {
            type: Boolean
        },
        active: {
            type: Boolean
        },
        medal: {
            type: Boolean
        }
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
},
    {
        collection: 'eoeVeteran'
    }
);

var modelName = 'EoeVeteran';

module.exports = mongoose.model(modelName, eoeVeteranModel);

