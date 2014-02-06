var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/' + (process.env.NIMBLE_DB || 2456));


var ContextSchema = mongoose.Schema({
    id: {type: String, index: true},
    title: {type: String, index: true},
    profiles: Array
});


var UserSchema = mongoose.Schema({
    email: {type: String, index: {unique: true, dropDups: true}},
    name: String,
    password: String,
    contexts: [ContextSchema]
});


// Exports ----------------------------------------------------------------------
module.exports = {
    User: mongoose.model('User', UserSchema),
    Context: mongoose.model('Context', ContextSchema)
};


// Helpers ----------------------------------------------------------------------
// var cleanDummyData = function() {
//     module.exports.Post.find({channel: '#kevin2'}, function(err, docs) {
//         docs.forEach(function(doc) {
//             doc.remove();
//         });
//     });
// };
