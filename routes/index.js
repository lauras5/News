const express = require('express');
const app = express();
const request = require('request'); 
const cheerio = require("cheerio"); 
const Articles = require('../models/Article');
const Notes = require('../models/Note');

// takes you to index page, checking connection
app.get('/',(req, res) => {
    res.render('index')
});

// newsfeed route
app.get('/newsfeed', (req, res) => {
    
    const scrapedUrl = 'https://www.cnet.com/news/'

    // making request to get html from site
    request(scrapedUrl, (err, res, html) => {

        // checks for errors
        if (e) throw e;

        const $ = cheerio.load(html);
    
        let article = [];
    
        $('.riverPost').each( (i, element) => {
            const res = $(element)
    
            const title = res.find('h3').text().replace(/\n/g, '').trim()
            const body = res.find('p').text().replace(/\n/g, '').trim()
            const url = res.find('a').attr('href');
            const author = res.find('.assetAuthor').text()
    
            article.push({
                title: title,
                body: body,
                url: 'https://www.cnet.com/news' + url,
                author: author,
                saved : false
            });
        });
        // app.get('/newsfeed', function (req, res) {
        //     res.render('newsfeed')
        //     console.log(article)
        // })
        console.log(article);
    });

})