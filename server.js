// dependencies
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const db = require('./models')

// initialize express
const app = express();

const Article = db.Article
const Note = db.Note

// require request & cheerio for scraping
const request = require('request');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 3000
// using morgan and body parser
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up handlebars, change extention name to hbs
app.engine("hbs", exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", "hbs");

// set up heroku
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// render index page
app.get('/', (req, res) => {
    res.render('index')
});

// renders all unsaved articles to the newsfeed
app.get('/newsarticles', (req, res) => {
    Article.find({ saved: false }).then(function (r) {
        res.render('newsfeed', { article: r })
    }).catch(function (e) {
        res.send(e)
    })
})

// finds all the articles that are saved
// renders them to savedarticles 
app.get('/savedArticles', (req, res) => {
    Article.find({ saved: true }).then(function (r) {
        res.render('savedArticles', { sarticle: r })
    }).catch(function (e) {
        res.send(e)
    });
});

// changes saved boolean value to true
app.post('/saved/:id', (req, res) => {
    Article.update({ _id: req.params.id }, { saved: true }, (err, doc) => {
        if (err) throw err
        return res.redirect('/newsarticles')
    });
})

// changes saved boolean value to false 
app.post('/unsaved/:id', (req, res) => {
    Article.update({ _id: req.params.id }, { saved: false }, (err, doc) => {
        if (err) throw err
        return res.redirect('/savedArticles')
    });
})

// posts note to both note schema and article schema
app.post('/note/:id', (req, res) => {
    // console.log(req.body.noteText) 
    const note = new Note({
        note: req.body.noteText
    });

    note.save((err) => {
        if (err) throw err
    })

    // pushes note into Article's note objectid array
    Article.update({ _id: req.params.id }, {
        '$push': { note }
    }, (err, doc) => {
        if (err) throw err;
        return res.redirect('/newsarticles')
    });
});

// // need to return comments and append to post
// app.get('/note/:id', (req, res) => {
//     Article.find({note : id}, (err, doc) => {
//         res.redirect('/newsarticles')
//     });
// });

app.post('/scrape', (req, res) => {
    const scrapedUrl = 'https://www.cnet.com/news/'

    // making request to get html from site
    request(scrapedUrl, (err, res, html) => {

        // always check for errors first
        if (err) throw err;

        const $ = cheerio.load(html);

        $('.riverPost').each((i, element) => {

            const r = $(element)

            const title = r.find('h3').text().replace(/\n/g, '').trim()
            const body = r.find('p').text().replace(/\n/g, '').trim()
            const url = r.find('a').attr('href');
            const author = r.find('.assetAuthor').text()

            console.log(Article)
            if (title && body && url && author) {
                const articleObj = new Article({
                    title: title,
                    body: body,
                    url: 'https://www.cnet.com/' + url,
                    author: author,
                    saved: false
                });

                if (title === Article.title) {
                    // add if statement for repeats
                    articleObj.save((err) => {
                        if (err) throw err;
                    })
                };
            } else {
                console.log('no title')
            }

        });
    });
    // redirects to feed page on click
    res.redirect('/newsarticles')
});

// listening for connection
app.listen(PORT, (err) => {
    if (err) throw err;
    console.log('MongoDB Scrapper listening on Port ' + PORT)
});

