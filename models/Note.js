// require mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create schema for note
var NoteSchema = new Schema({
    body : {
        type : String
    }
});

// takes model name and object
var Note = mongoose.model('Note', NoteSchema);

// export note model
module.exports = Note;