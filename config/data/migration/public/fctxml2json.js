    //
    //xml2Json = require('./xml2json.js');
    //
    //fs = require('fs');
    //
    //var x2js = new xml2Json.X2JS();


    var fs = require('fs'),
        xml2js = require('xml2js'),
        request = require('request');


    function runConversion() {
        var xmlFiles = ["tbl_CampusVisits", "tbl_CandidateInformation", "tbl_Comments", "tbl_eval",
            "tbl_positions", "tbl_RefComments", "tblCandEval_Nov2010", "tblNotes", "tblQualEval"];
        var jsonData = [];


        var x = 0;

        var loopXml = function (files) {
            // call itself
            getJsonData(files[x], function () {
                // set x to next item
                x++;
                // any more items in array?
                if (x < files.length) {
                    loopXml(files);
                }
                else {
                    postData();
                }
            });
        }


        //function getJsonData(tablename, callback) {
        //  fs.readFile(tablename + '.xml', 'utf8', function (err,data) {
        //    if (err) {
        //      return console.log(err);
        //    }
        //
        //    // $.get((tablename + ".xml"), function (response) {
        //        // var xml = new XMLSerializer().serializeToString(response);
        //        var xml = data;
        //
        //        var json = (x2js.xml_str2json(xml)).dataroot[tablename];
        //        jsonData.push({"table": tablename, "json": json});
        //      console.log(tablename, " converted\n");
        //        callback();
        //    });
        //}

        function getJsonData(tablename, callback) {
            var parser = new xml2js.Parser({explicitArray : false});
            fs.readFile(__dirname + '/' + tablename + '.xml', function(err, data) {
                parser.parseString(data, function (err, result) {
                    console.log('Parsed ', tablename);
                    jsonData.push({"table": tablename, "json": result.dataroot[tablename]});
                    console.log('Pushed ', tablename);
                    callback();
                });
            });

        }


        loopXml(xmlFiles);

        function postData(){
            console.log('Posting...');
            request({
                url: "http://localhost:3000/receive",
                method: "POST",
                json: {"legacy" : jsonData}
            });


                //.post(
                //'http://localhost:3000/receive',
                //{"data" : JSON.stringify(jsonData)},
                //function (error, response, body) {
                //    if (!error && response.statusCode == 200) {
                //        console.log('Success!!!')
                //    }
                //}
            //);
            //$.ajax({
            //    url: 'http://localhost:3000/receive',
            //    data: JSON.stringify(jsonData),
            //    type: 'POST',
            //    success: function (data) {
            //        $('#lblResponse').html(data);
            //        console.log('Success ')
            //    },
            //    error: function (xhr, status, error) {
            //        console.log('Error: ' + error.message);
            //        $('#lblResponse').html('Error connecting to the server.');
            //    }
            //});
        }
    }

    runConversion();
