

function disable_input(){
		myCodeMirror.setOption('readOnly', "nocursor");
		$("#run_button").attr("disabled", true);
		$("#language").prop("disabled", true);
		$('.CodeMirror').css("opacity", 0.5);
		$('.codebar-item').css("opacity", 0.5);
		$('#puzzle-panel').css("opacity", 0.5);
    $("#run_button").removeClass("round-button-hover");
    $("#run_button").css("cursor", "default");		

}

function enable_input(){
	myCodeMirror.setOption('readOnly', false);
	$("#run_button").attr("disabled", false);
	$("#language").prop("disabled", false);
	$('.CodeMirror').css("opacity", 1);
	$('.codebar-item').css("opacity", 1);
	$('#puzzle-panel').css("opacity", 1);
  $("#run_button").addClass("round-button-hover");
  $("#run_button").css("cursor", "pointer");  
}

function populate_puzzle_select() {
	let puzzle_options = "";
	for (var i in cur_puzzles) {
		puzzle_options += "<option value='" + i + "'>" + i + "</option>";
	}

	$("#puzzle").children().remove().end().append($(puzzle_options));

}


function puzzle_update() {
	var new_puzzle = $("#puzzle").val();

	$("#description").html(cur_puzzles[$("#puzzle").val()].description);

}

function language_update()  {

	var new_lang = $("#language").val().toLowerCase();

	myCodeMirror.setOption("mode", new_lang);


	myCodeMirror.setValue("");
	myOutput.setValue("");

	$('.CodeMirror').css("border", "2px solid " + lang_color(new_lang));
	$(".codebar-item").css("border", "2px solid " + lang_color(new_lang));
	$(".puzzle-item").css("border", "2px solid " + lang_color(new_lang));

	document.getElementById("logo").src = "/images/" + new_lang + ".svg";

}


function puzzle_percent(name) {

	if (all_puzzles[name].difficulty === "easy") {
		return 100 * (1 / points_needed);
	}
	else if (all_puzzles[name].difficulty === "moderate") {
		return 100 * (3 / points_needed);
	}
	else {
		return 100 * (5 / points_needed);
	}
}



function new_per(username, added_per) {
	var $this = $("#progress_" + username);
	
	var per = $this.attr("per").substring(0, $this.attr("per").length - 1);;

	return parseFloat(per) + parseFloat(added_per);
}

function update_per_val(username, new_per) {
	var $this = $("#progress_" + username);
	$this.attr("per", new_per + "%");
}
function update_per_bar(username, new_per) {
	var $this = $("#progress_" + username);
	

	var per = $this.attr("per").substring(0, $this.attr("per").length - 1);;


	$this.css("width", new_per + "%");
	
}
function update_per_text(username, new_per) {
	var $this = $("#progress_text_" + username);
	var per = $this.attr("per").substring(0, $this.attr("per").length - 1);;

	$({ animatedValue: per }).animate(
		{ animatedValue: new_per },
		
		{
			duration: 1000,
			step: function() {
				$this.attr("per", Math.floor(this.animatedValue) + "%");
			},
			complete: function() {
				$this.attr("per", Math.floor(this.animatedValue) + "%");
			}
		}
		);
}







	function submit_puzzle(i, _callback) {
		if (i < solved_puzzles.length) {

			$.post($(location).attr('href') + '/submit', 
				solved_puzzles[i],
			
			function(data,status){
				if (data.redirect) {
					window.location.href = data.redirect;
				}		
				else if (data.unlocked) {
					unlocked_puzzles.push(solved_puzzles[i].puzzle_name);
				}
				else if (data.new_lang) {
					new_lang_solutions.push(solved_puzzles[i].puzzle_name);
				}
				submit_puzzle(i+1, _callback);
			});
		}
		else{
			_callback();
		}
	}

function game_end(outcome_msg) {

	disable_input();
	$("#progress-panel").css("opacity", 1);
	$("#puzzle-panel").css("opacity", 1);
	$("#lang-panel").css("opacity", 1);
	$("#run-panel").css("opacity", 1);


	$("#puzzle_header").hide();
	$("#puzzle").hide();
	$("#description_header").hide();
	$("#description").hide();
	$(".space").hide();
	$(".cell").hide();

	submit_puzzle(0, function() {

		$("#gameover").text(outcome_msg);
		$("#gameover").show();
		$("#lobby").show();
		$("#rematch").show();
		if (unlocked_puzzles.length > 0) {
			if (unlocked_puzzles.length == 1) {
				$("#unlocked").html("&bull; You solved the <code>" + unlocked_puzzles[0] + 
					"</code> puzzle for the first time!");
			}
			else {
				$("#unlocked").html("&bull; You solved the " + list_to_string(unlocked_puzzles) + 
					" puzzles for the first time!");
			}
			$("#unlocked").show();
		}
		if (new_lang_solutions.length > 0) {
			if (new_lang_solutions.length == 1) {
				$("#new_lang").html("&bull; You solved the <code>" + new_lang_solutions[0] + 
					"</code> puzzle in a new language!");
			}
			else {
				$("#new_lang").html("&bull; You solved the " + list_to_string(new_lang_solutions) + 
					" puzzles in new languages!");
			}
			$("#new_lang").show();
		}
	});
}


function list_to_string(l) {
	if (l.length == 2) { 
		return "<code>" + l[0] + "</code> and <code>" + l[1] + "</code>"; 
	}
	else {
		let s = "";
		for (var i = 0; i < l.length; i++) {
			if (i == 0) { s+= "<code>" + l[i] + "</code>"; }
			else if (i == (l.length - 1)) { s += ", and <code>" + l[i] + "</code>"; }
			else { s += ", <code>" + l[i] + "</code>"; }
		}
		return s;
	}
}
