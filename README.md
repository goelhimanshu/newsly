Newsly
======

An example application to learn node.js, angular.js and MongoDB using express framework. This application helps user to read articles and highlight the text while reading and view the highlighted text later when needed.

This application demonstartes the power of fully loaded modern javascript framework i.e. node.js for backend and angular.js for front-end, along with a NO-SQL Database on MongoDB.

This application reads the large collection of news articles from unstructured database and displays the headline on landing page, from there user can select the article, he/she interested in. After opening the article user can has a option to highlight the text while reading and that will be saved in the database so that usercan come later and view it. User also have access to comment below the article.

Technologies & Setup 
====================
1. Node.js - Download the platform from http://nodejs.org/download/, install it and add it to system path variable.
2. MongoDB - Download mongodb distribution from https://www.mongodb.org/downloads, extract the files in some directory.
3. Start MongoDB - start mongoDB server and create a new database with a name of newsly.
4. Import data in our database - mongoImport -db newsly --collection articleCollection -- file data/article_dump.json

Now the platform is ready to run this application.

Why These Technologies used ?
=============================
Node.js - Used to create an application server which listen all requests may be for serving the view or requesting the data from it.
Our application runs on port 3000 so all HTTP requests will be made at port 3000. This port no. is configurable from app.js file in root folder

Express - It is a framework for node.js which create essentails required to run node.js server, in a vey organize way.

Angular.js - Used to serve real-time views and manage routing and handle data with a proper MVC architecture framework. Angular.js is considered best in this category.

MongoDB - To store our articles description and annotations such as highlight, comment. This is a NO-SQL database so it can be modified easilyin terms or structure.

Monk plugin - for communication between node.js and mongodb.

How it runs ?
=============
just go to the project directory and run "node app.js" command in your shell.
Now check the application at http://localhost:3000.

Note - initially there won't be any comments or highlights done, as this dump only contains description of articles.
So kndly add some annotations to few articles.


