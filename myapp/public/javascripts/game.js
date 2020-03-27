
var unlocked_puzzles;
var new_lang_solutions;
var cur_puzzles;
var solved_puzzles;
var all_puzzles;

var interval_id;




function rematch_request() {
	
	$("#rematch").hide();
	$("#rematch_msg").text("Rematch offer sent.")
	$("#rematch_req").show();
	$("#accept_button").hide();
	$("#decline_button").hide();
	socket.emit("rematch_request", user.username, game.id);
	inverval_id = window.setInterval(function(){
		socket.emit("request_check", game.id);
	}, 3000);
}

function rematch_accept() {
	socket.emit("rematch_accept", user.username, game.id);
}

function rematch_decline() {
	socket.emit("rematch_decline", user.username, game.id);
}




$(document).ready(function(){

	$("#gameover").hide();
	$("#unlocked").hide();
	$("#new_lang").hide();
	$("#lobby").hide();
	$("#rematch").hide();
	$("#rematch_req").hide();

	socket = io();

	/* after 5 seconds, verify that both players are in the room */
	setTimeout(live_check, 5000);

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
					solution_time = data.time;
					solution_length = data.length;
					myOutput.setValue(data.stdout + "\nRuntime: " + data.time.replace(/^\s+|\s+$/g, '') + " seconds\n\nSolution length: " + data.length + " characters");

					delete cur_puzzles[$("#puzzle").val()];

					solved_puzzles.push({
						puzzle_name: $("#puzzle").val(),
						solution: myCodeMirror.getValue(),
						language: $("#language").val().toLowerCase(),
						time: parseFloat(data.time),
						length: parseInt(data.length)
					});

					if (Object.keys(cur_puzzles).length == 0) {
						socket.emit("game_won", user.username, game.id);
						populate_puzzle_select();
					}
					else {
						socket.emit("puzzle_solved", user.username, game.id, $("#puzzle").val());
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
		update_per_bar(username, new_per(username, puzzle_percent(puzzle_name)));
		update_per_text(username, new_per(username, puzzle_percent(puzzle_name)));
		update_per_val(username, new_per(username, puzzle_percent(puzzle_name)));
	});

	socket.on("game_over", function(username) {

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

	socket.on("rematch_offer", function(opponent) {

		$("#rematch").hide();
		$("#rematch_req").show();
		$("#accept_button").show();
		$("#decline_button").show();	

		$("#rematch_msg").text(opponent + " is offering a rematch.")
	});

	socket.on("no_rematch", function(sender) {

		if (sender == user.username) {
			$("#rematch_req").hide();
		}
		else {
			clearInterval(inverval_id);
			$("#rematch_msg").text("Rematch offer declined.");
			$("#rematch_msg").css("color", "red");
			$("#rematch_msg").stop().show();
      $("#rematch_msg").fadeIn().delay(0).fadeOut(10000);
		}
	})

	socket.on("rematch_game", function(new_game_id) {
		window.location.href = "/play/" + new_game_id;
	});

	socket.on("opponent_disconnect", function() {
		window.location.href = '/play/' + game.id + '/terminated';

	});

	socket.on("opponent_left", function() {
		clearInterval(inverval_id);
		if (user.username == game.creator) {
			$("#rematch_msg").text(game.invitee + " has left the room.");
		}
		else {
			$("#rematch_msg").text(game.creator + " has left the room.");
		}
		$("#rematch_msg").css("color", "red");
		$("#rematch_msg").stop().show();
    $("#rematch_msg").fadeIn().delay(0).fadeOut(10000);
	});

});