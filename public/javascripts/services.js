angular.module('newsReaderServices', ['ngResource']).
	factory('Articles', function($resource) {
		return $resource('articlesList', {}, {
			query: { method: 'GET', params:{limit: "@limit", recordsOffset: "@recordsOffset"}, isArray: true }
		})

	}).
	factory('Article', function($resource) {
		return $resource('article/:id', {}, {
			query: { method: 'GET', isArray: false },
			post : { method: 'POST', params:{id : '@id'} , headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		})
	}).
	factory('Comment', function($resource) {
		return $resource('comments/:id', {}, {
			query: { method: 'GET', params:{id : '@id'}, isArray: false },
			post : { method: 'POST', params:{id : '@id'} , headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
		})
	});