console.log('hello...');
var fs = require("fs");
var candidateData;
fs.readFile("candidates.json", "utf8", function(error, data) {
    if (error) {
        throw error;
    }
    candidateData = data;
})

console.log(candidateData);

