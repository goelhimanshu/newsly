/*
 * Description : Angular.js Main module & Directivesscripts for newsly application front-end.
 * Author : Himanshu Goel
 * Date : 27th March 2014
 */

// Create a new angular application with dependency as newslyServices .
// Here the configs for routing of angular app is defined.
var app = angular.module('newsReader', ["newslyServices"])
          .config(['$routeProvider', function($routeProvider) {
            $routeProvider.
              when('/news', { templateUrl: 'angularView/list.html', controller: ArticleListCtrl }).
              when('/news/:articleId', { templateUrl: 'angularView/article.html', controller: ArticleContentCtrl  }).
              otherwise({ redirectTo: '/news' });
          }]);

//Angular Directive for article description page 
//Here the element is binded with a javascript event to pop-up the toolbar to give option to save the selection as highlight only or add notes to it.
//$Compile is imported to this directive as it is used for Dom Manipulations for compiling the updated dom structure 
app.directive("article", function($compile){
	var linker = function(scope, element, attrs){
		element.bind("mouseup", function(e) {
		    mousePos = {left: e.pageX + 2, top: e.pageY + 2};
			var span = document.createElement('tooltip');
			span = $compile(span)(scope);
			
			$(element).qtip({
				    content: {
				        text: span,
        				button: true
				    },
				    show: {
				        event: 'click'
				    },
				    style: {
				        classes: 'qtip-blue qtip-youtube'
				    },
				    position: {
				        target: [mousePos.left,mousePos.top]
				    },
				     hide: 'unfocus'
				});

			$compile(element)(scope);

        });
	}

	return {
		restrict : "E",
		template : '<div class="articleDescription">{{content.description}}</div>',
		replace : true,
		link: linker
	}
});

//Angular Directive For raised tooltips.
//Element is binded with click events based on id of save as selection or note
//$Compile is imported to this directive as it is used for Dom Manipulations for compiling the updated dom structure 
app.directive("tooltip", function($compile){
	var linker = function(scope, element, attrs){
		var a_elem = document.createElement("a");
		a_elem.setAttribute("class","btn btn-primary");
		a_elem.setAttribute("id","save_markdown");

		$compile(a_elem)(scope);
		$(a_elem).append("Save Highlighted");

		element.append(a_elem);

		a_elem = document.createElement("a");
		a_elem.setAttribute("class","btn btn-primary");
		a_elem.setAttribute("id","makeNote");
		$(a_elem).html("Comment");

		element.append(a_elem);
		

		$(element).find("#save_markdown").bind("click", function(e) {
			scope.getOffsets();
			scope.newMarkDownInPage();


			$(document).find(".qtip").each(function(){
				$(this).remove();
			});

		});

		$(element).find("#makeNote").bind("click", function(e) {
			scope.getOffsets();

			var form = angular.element(document.createElement('noteform'));

			$compile(form)(scope);

			element.replaceWith(form);
			
		});

		$compile(element)(scope);
		
	}

	return {
		restrict : "E",
		template: '<div class="tooltip_options"></div>',
		replace : true,
		link: linker
	};
});

//Angular Directive for form created in tooltip while creating note.
//Element is binded with form submission event.
//$Compile is imported to this directive as it is used for Dom Manipulations for compiling the updated dom structure 
app.directive("noteform", function($compile){
	var linker = function(scope, element, attrs){
		var input =  '<div class="form-group"><input type="text" ng-model="noteText" placeholder="Comment Here!!" class="col-lg-12 form-control"/>';
		element.append($compile(input)(scope));
		
		var submit =  '<button type="submit" class="btn btn-primary">Save</button>';
		element.append($compile(submit)(scope));

		element.bind("submit",function(){
			$(document).find(".qtip").each(function(){
				$(this).remove();
			});
		});
		$compile(element)(scope);

	}

	return {
		restrict : "E",
		template: '<form ng-submit="newNoteInPage()"></form>',
		replace : true,
		link: linker
	};
});

//Angular Directive for markdown text to highlight it and create a separate node of it.
app.directive("markdown", function(){
	return {
		restrict : "E",
		template: '<span class="highlightor"></span>',
		replace : true
	};
});

//Angular Directive for note text to highlight it and associate a tooltip of content with it.
app.directive("note", function($compile){
	var linker = function(scope, element, attrs){
		 $(element).qtip({
             content: {
                 text: attrs.content
             }
         });

         $compile(element)(scope);
	}
	return {
		restrict : "E",
		template: '<span class="note"></span>',
		link: linker,
		replace : true
	};
});

