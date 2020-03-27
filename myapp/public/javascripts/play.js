

function disable_input(){
		$("input").prop("disabled", true);
		$("#usernames").prop("disabled", true);
		$("#submit_game").prop("disabled", true);

		$('#submit_game').css("opacity", 0.5);
		$("#usernames").css("opacity", 0.5);
		$("img").css("opacity", 0.5);
		$(".image_label").css("opacity", 0.5);
		$("label").css("opacity", 0.5);
		$("input").css("opacity", 0.5);
}

function enable_input(){

		$("input").prop("disabled", false);
		$("#usernames").prop("disabled", false);
		$("#submit_game").prop("disabled", false);

		$('#submit_game').css("opacity", 1);
		$("#usernames").css("opacity", 1);
		$("img").css("opacity", 1);
		$(".image_label").css("opacity", 1);
		$("label").css("opacity", 1);
		$("input").css("opacity", 1);

}

function start_play(user, usernames) {

	var time_modal = document.getElementById("time_modal");

	var time_btn = document.getElementById("time_game");

	var time_span = document.getElementsByClassName("close")[0];

	var join_modal = document.getElementById("join_modal");

	var join_btn = document.getElementById("join_game");

	var join_span = document.getElementsByClassName("close")[1];

	var create_span = document.getElementsByClassName("close")[2];

	var create_modal = document.getElementById("create_modal");

	var create_btn = document.getElementById("create_game");

	var submit_time_btn = document.getElementById("submit_time_game");

	var submit_btn = document.getElementById("submit_game");



	/* remove the user's name from list of usernames */
	const index = usernames.indexOf(user.username);
	if (index > -1) {
		usernames.splice(index, 1);
	}
	
	$("#usernames").autocomplete({
		source: function(request, response) {
			var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
					response( $.grep( usernames, function( item ){
							return matcher.test( item );
				}) );
			}
	});

	var socket;
	var current_games;

	time_btn.onclick = function() {

		$("#footer").css("opacity", 0.4);
		$("#num_easy_time").val(1);
		$("#num_moderate_time").val(0);
		$("#num_challenging_time").val(0);
		$("#error_message_time").hide();
		time_modal.style.display = "block";

	}

	create_btn.onclick = function() {
		$("#footer").css("opacity", 0.4)
		create_modal.style.display = "block";
		enable_input();

		socket = io();
		socket.emit("start_create", user);

		$(":checkbox").prop("checked", true);
		$("#num_easy").val(1);
		$("#num_moderate").val(0);
		$("#num_challenging").val(0);
		$("#usernames").val("");
		$("#error_message").hide();
		$("#create_loader").hide();
	}


	join_btn.onclick = function() {

		$("#footer").css("opacity", 0.4);
		join_modal.style.display = "block";

		socket = io();

		socket.emit("join", user);

		socket.on("invitations", function(games) {

			$("#invitation_list").empty();
			let current_games = games;
			for (var i = 0; i < games.length; i++) {

				$("#invitation_list").append('<br><button style="text-align:center; width:280px" id="game_' + i + '">' + 
					'<span>' + current_games[i].creator + '</span></button>');

				$("#game_" + i).click(function() {
					socket.emit("accept", current_games[$(this).attr('id').split("_")[1]]);
					window.location.href = "/play/" + current_games[$(this).attr('id').split("_")[1]].id;
				})
			}
		});

		socket.on("invitation_update", function() {
			socket.emit("get_invitations", user);
		});

	}

	time_span.onclick = function() {
		time_modal.style.display = "none";
		$("#footer").css("opacity", 1);
	}


	join_span.onclick = function() {
		socket.emit("quit");

		join_modal.style.display = "none";
		$("#footer").css("opacity", 1);

	}

	create_span.onclick = function() {
		socket.emit("quit");
		create_modal.style.display = "none";
		$("#footer").css("opacity", 1);

	}

	submit_time_game.onclick = function() {

		if ((($("#num_easy_time").val() == 0) && ($("#num_moderate_time").val() == 0)) && 
						 ($("#num_challenging_time").val() == 0)) {
			$("#error_message_time").text("A game requires at least one puzzle.");
			$("#error_message_time").show();
		}
		else {
			
			$.post("/play/time-attack", {
				num_easy: $("#num_easy_time").val(),
				num_moderate: $("#num_moderate_time").val(),
				num_challenging: $("#num_challenging_time").val(),
				time_easy: 150,
				time_moderate: 300,
				time_challenging: 600
			},
			function(response,status) {
				if (response.redirect) {
					window.location.href = response.redirect;
				}
				else if (response.game_id) {
					window.location.href = '/play/time-attack/' + response.game_id;
					
				}
				else {
					$("#error_message_time").text("An error occurred during the creation of your game.");
					$("#error_message_time").show();
				}
			});
		}
	}

	submit_btn.onclick = function() {


		$("#error_message").hide();
		$("#create_loader").hide();

		if (!($('#create_modal input[type=checkbox]:checked').length)) {
			$("#error_message").text("You must select at least one language.");
			$("#error_message").show();
		}
		else if ((($("#num_easy").val() == 0) && ($("#num_moderate").val() == 0)) && 
						 ($("#num_challenging").val() == 0)) {
			$("#error_message").text("A game requires at least one puzzle.");
			$("#error_message").show();
		}
		else if ($("#usernames").val() === "") {
			$("#error_message").text("You need to invite someone to the game!");
			$("#error_message").show();
		}
		else if ($("#usernames").val() === user.username) {
			$("#error_message").text("You cannot invite yourself to the game!");
			$("#error_message").show();
		}
		else {

			$.post('verify-user', 
			{
				username: $("#usernames").val()
			},
			function(response, status) {
				if (response.not_found) {
					$("#error_message").text("Sorry, we could not find a user with that name.");
					$("#error_message").show();
				}
				else { 
					let langs = "";
					$(':checkbox').each(function() {
						if (this.checked) {
							langs += (langs == "" ? ($(this).val()) : "," + ($(this).val()));
						}
						
					});
					let game_info = {
						"languages": langs,
						"num_easy": $("#num_easy").val(),
						"num_moderate": $("#num_moderate").val(),
						"num_challenging": $("#num_challenging").val(),
						"creator": user.username,
						"invitee": $("#usernames").val()
					};

					disable_input();


					socket.emit("create_game", game_info);
				}
			});
		}

		socket.on("created", function() {
			$("#create_loader").show();
			$("#sent_message").html("<b>Game has been created! Waiting for " + $("#usernames").val() + " to join!</b>");
		});

		socket.on("game_accepted", function(game) {
			window.location.href = "/play/" + game.id;
		});

	}

	window.onclick = function(event) {

		if ((event.target == join_modal) || (event.target == create_modal)) {
			socket.emit("quit");

			join_modal.style.display = "none";
			create_modal.style.display = "none";
			$("#footer").css("opacity", 1);

		}
		if ((event.target == time_modal)) {
			time_modal.style.display = "none";
			$("#footer").css("opacity", 1);
		}
	}
}