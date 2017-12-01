var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.get("/", function(req, res) {
  res.render("index");
});
router.get("/scrape", function(req, res) {
	request('https://local.theonion.com', function (error, response, body) {
		var $ = cheerio.load(body);
	    var z = 1;
	    let newsHeadlines = [];
	    $('.postlist__item').each((index, element) => {
	      let $header = $(element).children('header').children('h1');
	      let $div = $(element).children('div .item__content');
	      let newsObject = {};
	      newsObject.id = index;
	      newsObject.headline = $header.children('a').text();
	      newsObject.link = $header.children('a').attr("href");
	      newsObject.summary = $div.children('.excerpt').text();
	      newsHeadlines.push(newsObject);
	    });
	    console.log('error:', error); // Print the error if one occurred
	    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	    res.send(newsHeadlines);

	});
});

router.post("/save", function(req, res){
	let newArticleToSave = new Article(req.body);
	newArticleToSave.save(function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			console.log("Success!");
			res.send("Success!");
		}
	});
});


router.get("/deletearticle/:id", function(req, res) {
  console.log("ID for deleting" + req.params.id);
  console.log("Delete function.");
  Article.findOneAndRemove({"_id": req.params.id}, function (err, offer) {
    if (err) {
      console.log("Nope can't delete that:" + err);
    } else {
    	res.send("Success");
      	console.log("I dare you to delete");
    }
    
  });
});

router.get("/savedarticles", function(req, res) {
	Article.find({}, function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      var hbsArticleObject = {
        articles: doc
      };
      res.render("savedarticles", hbsArticleObject);
    }
  });
});


module.exports = router;