var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    title: {
        type: String,
        require: true
    },
    summary : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    note : [{
        type : Schema.Types.ObjectId,
        ref: 'note'
    }]
});

var Article = mongoose.model('Article', ArticleSchema);

// exports Model
module.exports = Article;