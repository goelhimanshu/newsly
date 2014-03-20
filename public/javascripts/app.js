angular.module('newsReader', ["newsReaderServices"])
          .config(['$routeProvider', function($routeProvider) {
            $routeProvider.
              when('/news', { templateUrl: 'angularView/list.html', controller: ArticleListCtrl }).
              when('/news/:articleId', { templateUrl: 'angularView/article.html', controller: ArticleContentCtrl }).
              otherwise({ redirectTo: '/news' });
          }]);