// dependencies
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/news-scraper");
// requires all models in models folder
const exphbs = require('express-handlebars');
// var db = require('./models');
const articleModel = require('./models/Article.js');
const noteModel = require('./models/Note.js');

// Connect to the Mongo DB

const request = require('request');
const cheerio = require('cheerio');
// mongoose.Promise = Promise;

app.engine("hbs", exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", ".hbs");

// handle form submissions 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.listen(3000, (e) => {
    if (e) throw e;
    console.log('MongoDB Scrapper listening on Port 3000')
});

