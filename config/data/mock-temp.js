// EXAMPLE OF USING THE MOCKAROO API TO GENERATE RANDOM DATA

var Mockaroo = require('mockaroo'); // npm install mockaroo

var client = new Mockaroo.Client({
    apiKey: 'd6cbc520'
})

client.generate({
    count: 10,
    fields: [{
        name: 'firstname',
        type: 'First Name'
    }]
}).then(function(records) {
    for (var i=0; i<records.length; i++) {
        var record = records[i];
        console.log('record ' + i, ' : ' + record.firstname);
    }
});
