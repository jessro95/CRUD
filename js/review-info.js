$(document).ready(function() {// Initialize Parse app
Parse.initialize("860THENFsFFYdZ7rlzMuybkqVUWyTTUUc231za6X", "Zoc3ZsVE0HM7YIVnRhkrItGDRmsio8LNp7xo7dqo");



var ReviewInfo = Parse.Object.extend('ReviewInfo');

$('#review-star').raty(0);

$('form').submit(function(){
	var info = new ReviewInfo();

	var title = $('#review-title').val();
	info.set('Title', title);

	var description = $('#review-description').val();
	info.set('Description', description);

	var star = $('#review-star').raty('score');
	info.set('Star', star);

	//
	info.set('helpful',0);
	info.set('voted', 0);
	//save

	$('#review-title').val("");
	$('#review-description').val("");
	$('#review-star').raty(0);

	info.save(null, {
		success:getData
	})

	return false
})

//Write a function to get dta
var getData = function() {
		//NEW QUERY FOR CLASS
		var query = new Parse.Query(ReviewInfo)

		//parameter forquery -- where the title is not non
		query.notEqualTo('Title', '');

		// Execute the query When successful: Pass the returned data into buildList
		query.find({
			success:function(results){
				buildList(results);
			}
		})
}

//A function to build your list
var buildList = function(data){
	//Empty out the ordered list
	$('ol').empty();

	//for average-star
	var totalStar = 0;
	var totalReview = 0;

	//Loop thorugh the data, and apss each elements to the addItem function
	data.forEach(function(d){
		console.log("" + d.get('Star'));
		if(d.get('Star') != undefined){
			totalStar += d.get('Star');
		}
		totalReview++;
		addItem(d);
		
	})
	var avgStar = totalStar/totalReview;
	$('#average-star').raty({readOnly: true, score: avgStar});

}



var addItem = function(item){
	var title = item.get('Title');
	var description = item.get('Description');
	var star;
	if(item.get('Star')==undefined){
		star = 0;
	} else{
		star = item.get('Star');
	}
	var star = item.get('Star');
	var helpful = item.get('helpful');
	var voted = item.get('voted');

	//Append li that includeds text from thdata item
	var li = $('<div> <div class="starred" data-score="' + star + '"></div> <h3>' + title +  '</h3>');
	var thumbUp = $('<button>Helpful  <i class="fa fa-thumbs-up"></i></button>');
	var thumbDown = $('<button> Unhelpful  <i class="fa fa-thumbs-down"></i></button>');
		li.append('<p id=descriptioned> ' + description + '</p>');
		li.append(thumbUp);
		li.append(thumbDown);
		li.append(' <p>' + helpful + ' out of ' + voted + ' found this review helpful </p>');

	var cancel = $('</br><button id = "cancelButton"><span class="glyphicon glyphicon-remove">Delete</span></button></div>')
		li.append(cancel);

	// Click function on the button to destroy the item, then re-call getData
	thumbUp.click(function(){
		item.increment('helpful');
		item.increment('voted');
		item.save({
			success:getData
		})
	})

	thumbDown.click(function(){
		item.increment('voted');
		item.save({
			success:getData
		});
	})

	cancel.click(function() {
		item.destroy({
			success:getData
		})
	})

	$('ol').append(li)

	$('.starred').raty({
		readOnly: true,
  		score: function() {
    		return $(this).attr('data-score');
  		}
	});
	

}

getData();
});