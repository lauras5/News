// require mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create schema for note
var NoteSchema = new Schema({
    note : {
        type : String
    },
    article : {
        type : Schema.Types.ObjectId,
        ref : 'Article'
    }
});

// takes model name and object
var Note = mongoose.model('Note', NoteSchema);

// export note model
module.exports = Note;