- Export Access tables to XML
..
- Convert XML to JSON
..
- Import JSON to Mongo
mongoimport -d faculty-recruitment-system-dev -c legacy xml2json.json
- Extract individual collections from legacy table (convert this to JS that can be run from
terminal shell
Mongo Shell>
db.legacy.find({}).forEach(function(doc)
    { doc.legacy.forEach(function(table) {
        var newCollection = 'legacy_' + table.table;
        db[newCollection].insert(table.json);
        })
    })