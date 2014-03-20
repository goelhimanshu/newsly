function featuredArticlesCtrl($scope, Articles){
	$scope.list = Articles.query({limit: 5 , recordsOffset : 0});
}

function ArticleListCtrl($scope, Articles, Comment) {
	$scope.limit = 20;
	$scope.recordsOffset = 0;
  	$scope.list = Articles.query({limit: $scope.limit , recordsOffset : $scope.recordsOffset});
	$scope.commentList ;

  	$(window).scroll(function() {
	   if($(window).scrollTop() + window.innerHeight >= $(document).height()-2) {

	       $scope.recordsOffset += $scope.limit;
	       Articles.query({limit: $scope.limit , recordsOffset : $scope.recordsOffset}, function (result) {
                       $scope.list.push.apply($scope.list, result);
                    });
	   }
	});

  	$scope.form = {comment: ""} ;
	
	$scope.submitComment = function(articleId){
		Comment.post({id: articleId},$scope.form);	
		if($scope.commentList.hasOwnProperty("comments"))	
			$scope.commentList.comments.push($scope.form.comment);
		else
			$scope.commentList.comments = [$scope.form.comment];		
		$scope.form.comment = null;
	}

	$scope.toggleCommentBox = function(node, articleId){
		$(node.target).parents(".article").find(".commentBox").slideToggle();

		Comment.query({id: articleId}, function(data){
			$scope.commentList = data;
                    });
	}


	
}

function ArticleContentCtrl($scope,$routeParams, Article, Comment) {
	
	$scope.content ;

	Article.query({id: $routeParams.articleId}, function(data){
		$scope.content = data;
		$scope.highlight();
	});

	$scope.highlight = function(){
		if((typeof $scope.content != 'undefined') && $scope.content.hasOwnProperty("annotate")){
			for(var k in $scope.content.annotate){
				var annotation = $scope.content.annotate[k]
					makeSelection(annotation);
				}	
			}
	}

	$scope.newmarkdown = function (){
    	var range = window.getSelection();

		var annotationScripts = { "offsets" : {"startNodePath": pathToChunk(range.anchorNode), "startOffset" : range.anchorOffset , "endNodePath": pathToChunk(range.focusNode), "endOffset" : range.focusOffset}};

		Article.post({id: $routeParams.articleId}, annotationScripts );

		makeSelection(annotationScripts.offsets);

    }

	function makeSelection (offsets) {
			
        var chunk = document.getElementById("articleDescription");
        if (window.getSelection) {  // all browsers, except IE before version 9
            var rangeToSelect = document.createRange ();
            rangeToSelect.selectNodeContents (chunk);
            rangeToSelect.setStart(nodeAtPathFromChunk(chunk,offsets.startNodePath),offsets.startOffset);
            rangeToSelect.setEnd(nodeAtPathFromChunk(chunk,offsets.endNodePath),offsets.endOffset);

            var content = rangeToSelect.extractContents(),
			span = document.createElement('SPAN');
			span.setAttribute("class","highlightor");

			span.appendChild(content);
			var htmlContent = span.innerHTML;

			rangeToSelect.insertNode(span);

		   if (window.getSelection().empty) {  // Chrome
		     window.getSelection().empty();
		   } else if (window.getSelection().removeAllRanges) {  // Firefox
		     window.getSelection().removeAllRanges();
		   }

        } else {
            if (document.body.createTextRange) {    // Internet Explorer
                var rangeToSelect = document.body.createTextRange ();
                rangeToSelect.moveToElementText (chunk);
                rangeToSelect.select ();
                document.selection.empty();
            }
        }
    }

    $scope.form = {comment: ""} ;
	
	$scope.submitComment = function(articleId){
		Comment.post({id: articleId},$scope.form);		

		if($scope.content.hasOwnProperty("comments"))	
			$scope.content.comments.push($scope.form.comment);
		else
			$scope.content.comments = [$scope.form.comment];
		$scope.form.comment = null;
	}



    
}

function isChunk(node) {
  if (node == undefined || node == null) {
    return false;
  }
  return node.getAttribute("id") == "articleDescription";
}

function pathToChunk(node) {
  var components = new Array();

  // While the last component isn't a chunk
  var found = false;
  while (found == false) {
    var childNodes = node.parentNode.childNodes;
    var children = new Array(childNodes.length);
    for (var i = 0; i < childNodes.length; i++) {
      children[i] = childNodes[i];
    }        
    components.unshift(children.indexOf(node));

    if (isChunk(node.parentNode) == true) {
      found = true
    } else {
      node = node.parentNode;
    }
  }
  return components.join("/");
}

function nodeAtPathFromChunk(chunk, path) {
  var components = path.split("/");
  var node = chunk;
  for (i in components) {
    var component = components[i];
    node = node.childNodes[component];
  }
  return node;
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



