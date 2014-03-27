/*
 * Description : Angular.js controller scripts for newsly application front-end.
 * Author : Himanshu Goel
 * Date : 27th March 2014
 */


//Angular Controller to manage the list of featured articles in bot the views.
//@param : Articles is factory imported from newslyServices to hit Articles api
function featuredArticlesCtrl($scope, Articles){
	$scope.list = Articles.query({limit: 5 , recordsOffset : 0});
}

//Angular Controller to manage the complete list of articles on landing page.
//@description : it fetches 20 records at a time and load more when user scrolls down.
//@param : Articles is factory imported from newslyServices to hit articles api
function ArticleListCtrl($scope, Articles) {
	$scope.limit = 20;
	$scope.recordsOffset = 0;
  $scope.list = Articles.query({limit: $scope.limit , recordsOffset : $scope.recordsOffset});

  	$(window).scroll(function() {
	   if($(window).scrollTop() + window.innerHeight >= $(document).height()-2) {

	       $scope.recordsOffset += $scope.limit;
	       Articles.query({limit: $scope.limit , recordsOffset : $scope.recordsOffset}, function (result) {
                       $scope.list.push.apply($scope.list, result);
                    });
	   }
	});

}

//Angular Controller to manage the Article Description page.
//@description : it displays all annotations on content load.
//@param : Article is factory imported from newslyServices to hit single article api with id
//@param : Note is factory imported from newslyServices to hit api to post new note on a article.
function ArticleContentCtrl($scope,$compile,$routeParams, Article, Note) {
	
	$scope.content = "" ;
  $scope.noteText = "";
  $scope.selectedOffsets = {};

	Article.query({id: $routeParams.articleId}, function(data){
		$scope.content = data;
  });

  //This function basically keeps an eye over the main description whenever it is changed, it loads the annotations
  $scope.$watch(
    function () { return document.getElementsByClassName("articleDescription")[0].innerHTML },  
    function(newval, oldval){
        $scope.loadData();
    }, true);

  //This function loads the annotations to there respective places with description. 
  $scope.loadData = function(){
    //load markdowns & notes
      if($scope.content.annotations){
        for(var index = 0 ; index < $scope.content.annotations.length ; index++){
          var annotation = $scope.content.annotations[index];
          if(annotation.hasOwnProperty("content")){
            index++;
            $scope.noteInPage(annotation);
          }else{  
             $scope.markDownInPage(annotation);
          }
        }
      }
  }

  //This function add the new annotation of marking the text and storing it in db by communicating to node.js server.
  $scope.newMarkDownInPage = function(){

    var markDown = { 
                    "markDown" : {
                                    "offsets" : $scope.selectedOffsets
                                  }
                    };

    Article.post({id: $routeParams.articleId}, markDown );
    $scope.markDownInPage(markDown.markDown);
  }

  //This function loads the already marked annotations with highlight only part.
  //@param : markDown the json node containing info about its offsets.
  $scope.markDownInPage =function(markDown){
    if(markDown.offsets){
      var chunk = document.getElementsByClassName("articleDescription")[0];
      if (window.getSelection) {  // all browsers, except IE before version 9
          var rangeToSelect = document.createRange ();
          rangeToSelect.selectNodeContents (chunk);
          rangeToSelect.setStart(nodeAtPathFromChunk(chunk,markDown.offsets.startNodePath),markDown.offsets.startOffset);
          rangeToSelect.setEnd(nodeAtPathFromChunk(chunk,markDown.offsets.endNodePath),markDown.offsets.endOffset);

          var content = rangeToSelect.extractContents();

          var node = document.createElement('markDown');
          node = $compile(node)($scope);
          node.append(content);

          rangeToSelect.insertNode(node[0]);
          $compile(node)($scope);
      }
    }
  }

  //This function add the new annotation of marking the text with note on it and storing in db by communicating to node.js server.
  $scope.newNoteInPage = function(){
    var note = { 
                    "note" : {
                                     "offsets" : $scope.selectedOffsets,
                                     "content" : $scope.noteText
                                  }
                  };

    Note.post({id: $routeParams.articleId}, note );
    $scope.noteInPage(note.note);
  }

  //This function loads the already marked annotations with note associated to it.
  //@param : note the json node containing info about its offsets and content to be displayed.
  $scope.noteInPage =function(note){
    if(note.offsets){
      var chunk = document.getElementsByClassName("articleDescription")[0];
      if (window.getSelection) {  // all browsers, except IE before version 9
          var rangeToSelect = document.createRange ();
          rangeToSelect.selectNodeContents (chunk);
          rangeToSelect.setStart(nodeAtPathFromChunk(chunk,note.offsets.startNodePath),note.offsets.startOffset);
          rangeToSelect.setEnd(nodeAtPathFromChunk(chunk,note.offsets.endNodePath),note.offsets.endOffset);

          var content = rangeToSelect.extractContents();

          var node = document.createElement('note');
          node.setAttribute("noteContent",note.content);
          node = $compile(node)($scope);
          node.append(content);

          rangeToSelect.insertNode(node[0]);
          $compile(node)($scope);

          $(node).qtip({
             content: {
                 text: note.content
             },
             position: {
                 target: 'mouse', // Track the mouse as the positioning target
                 adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
             },
             style: {
                classes: 'qtip-dark qtip-bootstrap'
             }
         });

      }
    }
  }

  //This function returns the structure of offsets according to the selection currently made by user.
  $scope.getOffsets = function(){
   var selection = window.getSelection();
   $scope.selectedOffsets = { 
      "startNodePath": pathToChunk(selection.anchorNode), 
      "startOffset" : selection.anchorOffset , 
      "endNodePath": pathToChunk(selection.focusNode), 
      "endOffset" : selection.focusOffset
    }
  }
}


//Generic function to check whether a node is our article Discription's root node.
//@param : node the HTML node to be checked
function isChunk(node) {
  temp = $(node);
  if (node == undefined || node == null) {
    return false;
  }
  else return temp.hasClass("articleDescription");
  
}

//Function to get the path of any node relative to chunk node in string format  
//@param : node the HTML node whose path to be generated
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

//Function return the HTML node at of provided path related to article Description root node.
//@param : chunk the root node for article description
//@param : path the node's relative path in string format 
function nodeAtPathFromChunk(chunk, path) {
  var components = path.split("/");
  var node = chunk;
  for (i in components) {
    var component = components[i];
    node = node.childNodes[component];
  }
  return node;
}

//This function returns the relative time from current time stamps
//@param : milliseconds 
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

