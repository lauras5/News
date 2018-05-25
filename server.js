// dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

// const Article = require('./models/Article.js');
// const Note = require('./models/Note.js');
const db = require('./models')
const app = express();
const Article = db.Article
const Note = db.Note

// initialize express

const request = require('request');
const cheerio = require('cheerio');

// using morgan and body parser
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.engine("hbs", exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", "hbs");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// class way 
app.get('/', (req, res) => {
    res.render('index')
});

// sort by newest
app.get('/newsarticles', (req, res) => {
    Article.find({}).then(function (r) {
        res.render('newsfeed', { article: r })
    }).catch(function (e) {
        res.send(e)
    })
})

// // mongoose connection
// const db = mongoose.connection;

// db.on("error", function (error) {
//     console.log("Mongoose Error: ", error);
// });

// db.once("open", function () {
//     console.log("Mongoose connection successful.");
// });

// route to saved articles
app.get('/savedArticles', (req, res) => {
    Article.find({ saved: true }).then(function (r) {
        res.render('savedArticles', { sarticle: r })
    }).catch(function (e) {
        res.send(e)
    })
});

app.post('/saved/:id', (req, res) => {
    Article.update({_id : id}).then(function (r) {
        res.json(r)
    })
})

app.post('/scrape', (req, res) => {
    const scrapedUrl = 'https://www.cnet.com/news/'

    // making request to get html from site
    request(scrapedUrl, (err, res, html) => {

        // always check for errors first
        if (err) throw err;

        // let articleObj = [];

        const $ = cheerio.load(html);

        $('.riverPost').each((i, element) => {

            const r = $(element)

            const title = r.find('h3').text().replace(/\n/g, '').trim()
            const body = r.find('p').text().replace(/\n/g, '').trim()
            const url = r.find('a').attr('href');
            const author = r.find('.assetAuthor').text()

            if (title && body && url && author && unique) {
                const articleObj = new Article({
                    title: title,
                    body: body,
                    url: 'https://www.cnet.com/news' + url,
                    author: author,
                    saved: false
                })

                console.log(articleObj.body);

                // add if statement for repeats
                articleObj.save((err) => {
                    if (err) throw err;
                })
            }
        });
    });
});

app.listen(3000, (err) => {
    if (err) throw err;
    console.log('MongoDB Scrapper listening on Port 3000')
});

