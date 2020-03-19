
var new_rank;
var user;


function get_rank_path(rank) {

	return "/images/ranks/" + rank.toLowerCase() + ".png";
}

$(document).ready(function(){
	console.log(new_rank);
	if (new_rank) {
		alert("A winner is you! Congratulations on gaining the rank of " + user.rank + ".");
	}
});