/**
 * Created by toastie on 1/21/16.
 */
db.legacy.find({}).forEach(function(doc) {
    doc.legacy.forEach(function(table) {
        var newCollection = 'legacy_' + table.table;
        db[newCollection].insert(table.json);
    })
})