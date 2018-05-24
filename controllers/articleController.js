const express = require('express');
const app = express();
// const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

// require models
const Article = require('../models/Article.js');
const Note = require('../models/Note.js');

app.get('/', (req, res) => {
    res.redirect('/scrape')
});

app.get('/scrape', (req, res) => {
    const scrapedUrl = 'https://www.cnet.com/news/'

    request(scrapedUrl, (err, res, html) => {

        // checks for errors
        if (e) throw e;

        const $ = cheerio.load(html);

        $('.riverPost').each((i, element) => {
            const res = $(element)

            const title = res.find('h3').text().replace(/\n/g, '').trim()
            const body = res.find('p').text().replace(/\n/g, '').trim()
            const url = res.find('a').attr('href');
            const author = res.find('.assetAuthor').text()

            if (title && body && url && author) {
                var result = {}

                result.title = title;
                result.body = body;
                result.url = url;
                result.author = author;

                Article.create(result, (err, data) => {
                    if (e) throw e;
                    console.log(data)
                });
            }

            // article.push({
            //     title: title,
            //     body: body,
            //     url: 'https://www.cnet.com/news' + url,
            //     author: author,
            //     saved : false
            // });
        });
    });
    res.redirect('/')
});

// get the articles that were scraped and show them on newsfeed by descending order
app.get('/newsfeed', (req, res) => {
    Article.find({}, (e, data) => {
        if (e) throw e
        res.render('index', { result: data });
    })
    // sort in descending order
    Article.sort({ '_id': -1 })
})

// Create a note for article 
app.post('/newsfeed/:id', (req, res) => {
    Note.create(req.body, (e, data) => {
        if (e) throw e;
        Article.findOneAndUpdate(
            {
                '_id': req.params.id
            },
            {
                // pushes value into array
                $push: {
                    'note': data._id
                }
            })

    })
})
