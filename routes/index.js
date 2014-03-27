// For MongoDB connection
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/newsly');

var articlesPerPage = 20;
var headlineWordCount = 5;
var articleIntroWordCount = 20;
var collectionName = "articleCollection";

exports.index = function(req, res){
  res.render('index', { title: 'Newsly' });
};

exports.articles = function(req, res) {
    var collection = db.get(collectionName);
    collection.find({},{limit: req.query.limit, skip: req.query.recordsOffset},function(e,list){
    	var responseList = new Array();
    	var index = 0;
    	list.forEach( function(element){
    		element.headline = getNWords(element.description,headlineWordCount);
    		element.intro = getNWords(element.description,articleIntroWordCount);
			var date = new Date();
			element.date = date.getTime() - (Math.floor((Math.random()*1000000)+1));

			responseList[index] = {};
			responseList[index].id = element._id;
			responseList[index].headline = element.headline;
			responseList[index].intro = element.intro;
			responseList[index].date = timeSince(element.date)+" ago";

			responseList[index].commentCount = null;
			if(element.hasOwnProperty("comments"))
				responseList[index].commentCount = element.comments.length;

			index ++;

    	});
    	res.json(responseList);
    });
};

exports.article = function(req, res) {
	var collection = db.get(collectionName);
	var articleId = req.params.id;
	collection.findById(articleId, function(e, details){
				var words = details.description.split(/\s+/);
				details.headline = getNWords(details.description,headlineWordCount);
				var date = new Date();
				details.date = date.toString();
				res.json(details);
			});	
}

exports.comments = function(req, res) {
	var collection = db.get(collectionName);
	var articleId = req.params.id;
	collection.findById(articleId, function(e, details){
				if(details.hasOwnProperty("comments"))
					res.send({comments : details.comments});
				else
					res.json(null);
			});	
}

exports.addMarkdown = function(req,res) {

	var collection = db.get(collectionName);
	var articleId = req.params.id;
	collection.findAndModify({"_id" : articleId},{$push : {annotations : req.body.markDown}});
	
	collection.findById(articleId, function(e, details){
				res.json(200);
			});	
}

exports.addComment = function(req,res) {

	var collection = db.get(collectionName);
	var articleId = req.params.id;
	collection.findAndModify({"_id" : articleId},{$push : {comments : req.body.comment}});
	
	collection.findById(articleId, function(e, details){
				res.json(200);
			});	
}

exports.addNote = function(req,res) {

	var collection = db.get(collectionName);
	var articleId = req.params.id;
	collection.findAndModify({"_id" : articleId},{$push : {annotations : req.body.note}});
	collection.findById(articleId, function(e, details){
		res.send(req.body.note.content); 
	});
}

function timeSince(milliseconds) {

	var current = new Date();

	var seconds = (current - milliseconds)/1000;

	var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return interval + " Years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " Months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + " Days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + " Hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " Minutes";
    }
    return Math.floor(seconds) + " Seconds";
}

function getNWords(content, noOfWords){
	var words = content.split(/\s+/);
   	var result = words[0];
	for (var i = 1; i < noOfWords; i++) {
			result += "  "+words[i];
		};

	return result;
}