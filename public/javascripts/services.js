/*
 * Description : Angular.js Factory scripts for newsly application front-end.
 * Author : Himanshu Goel
 * Date : 27th March 2014
 */


angular.module('newslyServices', ['ngResource']).
	//This factory provides the access to get the list of requested articles from MongoDB server.
	factory('Articles', function($resource) {
		return $resource('articlesList', {}, {
			query: { method: 'GET', params:{limit: "@limit", recordsOffset: "@recordsOffset"}, isArray: true }
		})

	}).
	//This factory provides the access to get & update the details of requested article from MongoDB server.
	factory('Article', function($resource) {
		return $resource('article/:id', {}, {
			query: { method: 'GET', isArray: false },
			post : { method: 'POST', params:{id : '@id'} , headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		})
	}).
	//This factory provides the access to create new annotation with note content in it, for the respective article and store it in MongoDB server.
	factory('Note', function($resource) {
		return $resource('notes/:id', {}, {
			post : { method: 'POST', params:{id : '@id'} , headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		})
	});