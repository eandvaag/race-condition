
var unlocked_puzzles;
var new_lang_solutions;
var cur_puzzles;
var solved_puzzles;
var all_puzzles;



function disable_input(){
		myCodeMirror.setOption('readOnly', "nocursor");
		$("#run_button").attr("disabled", true);
		$("#language").prop("disabled", true);
		$('.CodeMirror').css("opacity", 0.5);
		$('.codebar-item').css("opacity", 0.5);
		$('.puzzle-item').css("opacity", 0.5);

}

function enable_input(){
	myCodeMirror.setOption('readOnly', false);
	$("#run_button").attr("disabled", false);
	$("#language").prop("disabled", false);
	$('.CodeMirror').css("opacity", 1);
	$('.codebar-item').css("opacity", 1);
	$('.puzzle-item').css("opacity", 1);

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
	//$('p').remove(".stats")
	//myCodeMirror.style.border = "2px solid " + lang_color(new_lang);
	$('.CodeMirror').css("border", "2px solid " + lang_color(new_lang));
	$(".codebar-item").css("border", "2px solid " + lang_color(new_lang));
	$(".puzzle-item").css("border", "2px solid " + lang_color(new_lang));
	//$('#code_panel').css("border", "2px solid " + lang_color(new_lang));
	//$('#puzzle_panel').css("border", "2px solid " + lang_color(new_lang));
	//document.getElementById("codeeditor").style.border = "2px solid " + lang_color(new_lang);
	document.getElementById("logo").src = "/images/" + new_lang + ".svg";

}

function populate_puzzle_select() {
	let puzzle_options = "";
	for (var i in cur_puzzles) {
		puzzle_options += "<option value='" + i + "'>" + i + "</option>";
	}
	/*
	}
	for (var i = 0; i < Object.keys(cur_puzzles).length; i++) {
		puzzle_options += "<option value='" + cur_puzzles[i].name + "'>" + cur_puzzles[i].name + "</option>";
	}*/
	/*$("select[name='puzzle_select']").append($(puzzle_options));*/
	$("#puzzle").children().remove().end().append($(puzzle_options));

}

function puzzle_percent(name) {

	//for (var i = 0; i < cur_puzzles.length; i++) {
	//  if (cur_puzzles[i].name === name) {
	console.log("puzzle percent", all_puzzles[name]);
 // console.log(cur_puzzles)
	//console.log(cur_puzzles[name][difficulty]);
	if (all_puzzles[name].difficulty === "easy") {
		console.log("returning", 1 / points_needed);
		return 100 * (1 / points_needed);
	}
	else if (all_puzzles[name].difficulty === "moderate") {
		return 100 * (3 / points_needed);
	}
	else {
		return 100 * (5 / points_needed);
	}
}
$(document).ready(function(){

	$("#gameover").hide();
	$("#unlocked").hide();
	$("#new_lang").hide();

	socket = io();

	/* after 5 seconds, verify that both players are in the room */
	setTimeout(live_check, 5000);


	console.log(user.username + " is attempting to join the room");
	socket.emit("game_start", user.username, game.id);


	unlocked_puzzles = [];
	new_lang_solutions = [];

	cur_puzzles = {};
	solved_puzzles = [];
	all_puzzles = {};
	for (var i = 0; i < puzzles.length; i++) {
		cur_puzzles[puzzles[i].name] = puzzles[i];
		all_puzzles[puzzles[i].name] = puzzles[i];
	}

	let langs = game.languages.split(",");
	let lang_options = "";
	for (var i = 0; i < langs.length; i++) {
		lang_options += "<option value='" + langs[i] + "'>" + langs[i] + "</option>";
	}

	$("#language").append($(lang_options));

	populate_puzzle_select();

	myCodeMirror = CodeMirror.fromTextArea(document.getElementById("codeeditor"), {
											lineNumbers: true,
											mode: "python",
											theme: "dracula"
	});

	myOutput = CodeMirror.fromTextArea(document.getElementById("codeoutput"), {
											theme: "base16-dark",
											mode: "plain",
											readOnly: "nocursor"
	});

	language_update();
	puzzle_update();

	$("#language").change(function(){
		language_update();
	});

	$("#puzzle").change(function(){
		puzzle_update();
	});


	$("#run_button").click(function(){
		disable_input();

		//myCodeMirror.theme = "base16-dark";
		console.log("clicked");
		//console.log($("#codeeditor").val());
		console.log($("#language").val());
		$.post($(location).attr('href'),
		{
			puzzle_name: $("#puzzle").val(),
			user_fun: myCodeMirror.getValue(),
			lang: $("#language").val()
		},
		
		function(data,status){

			if (data.redirect) {
				window.location.href = data.redirect;
			} else {

				if (data.timeout) {
					enable_input();
					myOutput.setValue("Your program was terminated.\nIt took too long to run. Sorry!")
				}
				else if (data.stderr !== "") {
					enable_input();
					myOutput.setValue(data.stderr);
				}
				else if (data.error) {
					enable_input();
					myOutput.setValue(data.stdout)
				}
				else if (data.passed_all) {
				//if (data.res === "All tests passed!\n") {
					console.log("this happened");
					console.log("your time is:", data.time);
					console.log("solution length is:", data.length);
					//$("#submit_button").show();
					//$("#edit_button").show();
					solution_time = data.time;
					solution_length = data.length;
					//alert(data.res + "\nRuntime: " + data.time.replace(/^\s+|\s+$/g, '') + " seconds\n\nSolution length: " + data.length + " characters")
					myOutput.setValue(data.stdout + "\nRuntime: " + data.time.replace(/^\s+|\s+$/g, '') + " seconds\n\nSolution length: " + data.length + " characters");




					delete cur_puzzles[$("#puzzle").val()];
					//console.log(cur_puzzles);

					solved_puzzles.push({
						puzzle_name: $("#puzzle").val(),
						solution: myCodeMirror.getValue(),
						language: $("#language").val().toLowerCase(),
						time: parseFloat(data.time),
						length: parseInt(data.length)
					});
					//socket.emit("submit_puzzle", user.username, $("#puzzle").val(), myCodeMirror.getValue(), 
					//	$("#language").val().toLowerCase(), parseFloat(data.time), parseInt(data.length));

					if (Object.keys(cur_puzzles).length == 0) {
						socket.emit("game_won", user.username, game.id);
						populate_puzzle_select();
						//puzzle_update();
						//update_per(user.username, 100);
						//gameover_modal.style.display = "block";
					}
					else {
						socket.emit("puzzle_solved", user.username, game.id, $("#puzzle").val());
						// new_per(user.username, puzzle_percent($("#puzzle").val())));
						myCodeMirror.setValue("");
						/* update puzzle list */
						
						populate_puzzle_select();
						puzzle_update();
						enable_input();
					}

				}
				else {
					/* ??? */
					enable_input();
					myOutput.setValue(data.stdout)
				}
			}
		});

	});

	function live_check() {
		socket.emit("live_check", game.id);
	}

	socket.on("update_per", function(username, puzzle_name) {
		console.log(user.username + " is updating the per of " + username);
		update_per_bar(username, new_per(username, puzzle_percent(puzzle_name)));
		update_per_text(username, new_per(username, puzzle_percent(puzzle_name)));
		update_per_val(username, new_per(username, puzzle_percent(puzzle_name)));
	});

	socket.on("game_over", function(username) {
		console.log(user.username + " knows that " + username + " has won the game.");
		disable_input();
		$("#progress-item").css("opacity", 1);
		$(".puzzle-item").css("opacity", 1);
		update_per_bar(username, 100);
		update_per_text(username, 100);
		update_per_val(username, 100);
		if (user.username === username) {
			game_end("You won!");
		}
		else {
			game_end("You lost.");
		}
	});
/*
	socket.on("unlocked_puzzle", function(puzzle_name) {
		unlocked_puzzles.push(puzzle_name);
	});

	socket.on("new_language", function(puzzle_name) {
		new_lang_solutions.push(puzzle_name);
	});
*/

	socket.on("opponent_disconnect", function() {
		console.log("my opponent disconnected");
		window.location.href = '/play/' + game.id + '/terminated';
		//disable_input();
		//$("#message").text("Your opponent has disconnected.");
		//$("#message").show();
	});

	function new_per(username, added_per) {
		var $this = $("#progress_" + username);
		
		var per = $this.attr("per").substring(0, $this.attr("per").length - 1);;

		console.log("per", per);
		console.log("added_per", added_per);
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
		
	//});
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
					console.log("solved_puzzles", solved_puzzles);
					console.log("i", i);
					console.log("solved_puzzles[i]", solved_puzzles[i]);
					console.log("solved_puzzles[i].puzzle_name", solved_puzzles[i].puzzle_name);
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



		submit_puzzle(0, function() {
			$("#puzzle_header").hide();
			$("#puzzle").hide();
			$("#description_header").hide();
			$("#description").hide();
			$(".space").hide();


			$("#gameover").text(outcome_msg);
			$("#gameover").show()
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
/*
		for (var i = 0; i < solved_puzzles.length; i++) {
			$.when( $.post($(location).attr('href') + '/submit', 
				solved_puzzles[i]) ).then(
		
			function(data,status){
				if (data.redirect) {
					window.location.href = data.redirect;
				}
				else if (data.unlocked) {
					console.log("solved_puzzles", solved_puzzles);
					console.log("i", i);
					console.log("solved_puzzles[i]", solved_puzzles[i]);
					console.log("solved_puzzles[i].puzzle_name", solved_puzzles[i].puzzle_name);
					unlocked_puzzles.push(solved_puzzles[i].puzzle_name);
				}
				else if (data.new_lang) {
					new_lang_solutions.push(solved_puzzles[i].puzzle_name);
				}
			});

		}
*/


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
/*
$(".progress-per").each(function() {
	var $this = $(this);
	var per = $this.attr("per");
	$this.css("width", per + "%");
	$({ animatedValue: 0 }).animate(
		{ animatedValue: per },
		
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
	});
*/

});