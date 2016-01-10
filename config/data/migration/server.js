var express = require('express'),
    app = express(),
    fs = require('fs'),
    url = require('url');

app.get('/', function (req, res) {
    res.send('Hello World!');
});


//app.use(express.static('public'));


app.use('/public', express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/public'));

app.post('/receive', function(request, respond) {
    var body = '';
    filePath = __dirname + '/xml2json.json';
    request.on('data', function(data) {
        body += data;
    });

    request.on('end', function (){
        fs.appendFile(filePath, body, function() {
            respond.end();
        });
    });
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});



