var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    title: {
        type: String,
        require: true
    },
    body : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
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
        ref: 'Note'
    }]
});

var Article = mongoose.model('Article', ArticleSchema);

// exports Model
module.exports = Article;