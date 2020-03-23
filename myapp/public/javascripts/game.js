
var unlocked_puzzles;
var new_lang_solutions;
var cur_puzzles;
var solved_puzzles;
var all_puzzles;

var interval_id;




function rematch_request() {
	console.log("sending rematch request");
	$("#rematch").hide();
	$("#rematch_msg").text("Rematch offer sent.")
	$("#rematch_req").show();
	$("#accept_button").hide();
	$("#decline_button").hide();
	socket.emit("rematch_request", user.username, game.id);
	inverval_id = window.setInterval(function(){
		console.log("checking liveness");
		socket.emit("request_check", game.id);
	}, 3000);
}

function rematch_accept() {
	console.log("accepting rematch");
	socket.emit("rematch_accept", user.username, game.id);
}

function rematch_decline() {
	console.log("declining rematch");
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
		console.log("I got a rematch offer");
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
/*
	socket.on("unlocked_puzzle", function(puzzle_name) {
		unlocked_puzzles.push(puzzle_name);
	});

	socket.on("new_language", function(puzzle_name) {
		new_lang_solutions.push(puzzle_name);
	});
*/

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