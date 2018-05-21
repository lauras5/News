// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// requires all models in models folder
var db = require('./models');

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/news-scraper");

var app = express();

var request = require('request');
var cheerio = require('cheerio');
mongoose.Promise = Promise;

// handle form submissions 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

var exphbs = require('express-handlebars');

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "hbs");

app.get('/newsfeed', function(req, res) {
    request('http://time.com/section/tech/', function(err, res, html) {
        var $ = cheerio.load(html);

        $('article.partial.tile.media.image-top.type-article').each(function(i, element) {
            var title = $(element).children('.headline').text();
        })
    })
    console.log(title)
});

app.post('/newsfeed/new', function(req, res) {

});


app.get('/notes', function(req, res) {

});
app.post('/notes/new', function(req, res) {

});


app.listen(3000, function(e) {
    if (e) throw e;
    console.log('Listening on Port 3000')
});

// request('http://time.com/section/tech/', function (e, r, html) {
//     if (e) throw e;

//     var $ = cheerio.load(html)
//     var results = [];

//     $('div.headline').each(function (i, element) {
//         var title = $(element).text()
//         var url = $(element).children().attr('href');

//         results.push({
//             title: title,
//             url: url
//         })

//     })

//     console.log(results)
// })