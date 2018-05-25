var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    title: {
        type: String,
        require: true,
        unique: true
    },
    body : {
        type : String,
        required : true,
        unique: true
    },
    url : {
        type : String,
        required : true,
        unique: true
    },
    author : {
        type : String,
        require : true,
    },
    saved : {
        type : Boolean,
        default : false
    },
    note : [{
        type : Schema.Types.ObjectId,
        ref: 'note'
    }]
});

var Article = mongoose.model('Article', ArticleSchema);

// exports Model
module.exports = Article;