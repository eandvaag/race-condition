/* server side socket io handler */

const models = require('./models');
var landing = require('./controllers/landing')
var sequelize = require('sequelize');
var moment = require('moment');
var crypto = require('crypto');
var model_lib = require("./model_lib");


var socket_io = require('socket.io');
var io = socket_io();
var socket_api = {};

socket_api.io = io;


io.on('connection', function(socket){
		console.log('A user connected');


	socket.on("rematch_accept", function(sender, game_id) {
		console.log("rematch accepted, setting up game");
		
		return models.games.findOne({
			where: {
				id: game_id }
		}).then(game => {

			return models.users.update({
						status: "starting" }, {returning: true,
					where: {
						username: [game.creator, game.invitee]
					}
			}).then(updated => {
				var hash = crypto.createHash('md5').update(
					game.creator + game.invitee + moment().utc().format('hh:mm:ss'))
				.digest('hex');

				model_lib.fetch_random_puzzles('easy', game.num_easy)
				.then(easy_puzzles => {
					model_lib.fetch_random_puzzles('moderate', game.num_moderate)
					.then(moderate_puzzles => {
						model_lib.fetch_random_puzzles('challenging', game.num_challenging)
						.then(challenging_puzzles => {
							let puzzle_names = "";
							let puzzles = easy_puzzles.concat(moderate_puzzles.concat(challenging_puzzles));
							for (var i = 0; i < puzzles.length; i++) {
								if (i == 0) puzzle_names += puzzles[i].name;
								else puzzle_names += "," + puzzles[i].name;
							}
							console.log("puzzle_names", puzzle_names);

							/* store the game */
							return models.games.create({
										id: hash,
										creator: game.creator,
										invitee: game.invitee,
										status: "in_progress",
										languages: game.languages,
										num_easy: game.num_easy,
										num_moderate: game.num_moderate,
										num_challenging: game.num_challenging,
										puzzle_names: puzzle_names,
							}).then(new_game => {
								io.in(game_id).emit("rematch_game", hash);
							}).catch(err => {
								console.log(err);
							});
						}).catch(err => {
							console.log(err);
						});
					}).catch(err => {
						console.log(err);
					});
				}).catch(err => {
					console.log(err);
				});
			}).catch(err => {
				console.log(err);
			});
		}).catch(err => {
			console.log(err);
		});
	});

	socket.on("rematch_decline", function(sender, game_id) {
		io.in(game_id).emit("no_rematch", sender);
	})


	socket.on("rematch_request", function(sender, game_id) {


		return models.games.findOne({
			where: {
				id: game_id }
		}).then(game => {
			if (sender == game.creator) {
				return models.users.findOne({
					where: {
						username: game.invitee
					}
				}).then(receiver => {
					console.log(sender + " is sending a rematch offer to " + receiver.username);
					io.to(receiver.socket_id).emit("rematch_offer", sender);
				}).catch(err => {
					console.log(err);
				});
			}
			else {
				return models.users.findOne({
					where: {
						username: game.creator
					}
				}).then(receiver => {
					console.log(sender + " is sending a rematch offer to " + receiver.username);
					io.to(receiver.socket_id).emit("rematch_offer", sender);
				}).catch(err => {
					console.log(err);
				});
			}
		}).catch(err => {
			console.log(err);
		});
	});


	socket.on("game_start", function(username, game_id) {

		return models.games.findOne({
			where: {
				id: game_id }
		}).then(game => {
			if (username === game.creator) {
				return models.users.update({
					status: "create_playing",
					socket_id: socket.id }, {returning: true,
						where: {
							username: username } 
				}).then(update => {
					console.log(username + "joined game " + game_id);
					socket.join(game_id);
				}).catch(err => {
					console.log(err);
				});
			} 
			else if (username === game.invitee) {
				return models.users.update({
					status: "join_playing",
					socket_id: socket.id }, {returning: true,
						where: {
							username: username }
				}).then(update => {
					console.log(username + "joined game " + game_id);
					socket.join(game_id);
				}).catch(err => {
					console.log(err);
				});
			}
			else {
				console.log("user is neither creator nor invitee");
				console.log("username", username);
				console.log("game.creator", game.creator);
				console.log("game.invitee", game.invitee);
			}
		}).catch(err => {
			console.log(err);
		});
	});

	socket.on("live_check", function(game_id) {
		var room = io.sockets.adapter.rooms[game_id];
		if (!room) {
			io.in(game_id).emit("opponent_disconnect");
		}
		else if (room.length !== 2) {
			io.in(game_id).emit("opponent_disconnect");
		}
	});


	socket.on("request_check", function(game_id) {
		var room = io.sockets.adapter.rooms[game_id];
		if (!room) {
			io.in(game_id).emit("opponent_disconnect");
		}
		else if (room.length !== 2) {
			io.in(game_id).emit("opponent_left");
		}	
	});

	socket.on("puzzle_solved", function(username, game_id, puzzle_name) {
		var room = io.sockets.adapter.rooms[game_id];
		if (!room) {
			io.in(game_id).emit("opponent_disconnect");
		}
		else if (room.length !== 2) {
			io.in(game_id).emit("opponent_disconnect");
		}
		else {
			/* notify everyone in the room to update the sender's score */
			console.log(username + " solved the " + puzzle_name + " puzzle");
			io.in(game_id).emit("update_per", username, puzzle_name);
		}
	});

	socket.on("game_won", function(username, game_id) {
		var room = io.sockets.adapter.rooms[game_id];
		if (!room) {
			io.in(game_id).emit("opponent_disconnect");
		}
		else if (room.length !== 2) {
			io.in(game_id).emit("opponent_disconnect");			
		}
		else {

			return models.games.update({
					status: "completed" }, {returning: true,
				where: { id: game_id } 
			}).then(game_updated => {
				return models.games.findOne({
					where: {id: game_id}
				}).then(game => {
					/* creator won */
					if (username === game.creator) {
						model_lib.update_user_games(game.creator, "won")
						.then(updated_creator => {
							model_lib.update_user_games(game.invitee, "lost")
							.then(updated_invitee => {
								io.in(game_id).emit("game_over", username);
							}).catch(err => {
								console.log(err);
							});
						}).catch(err => {
							console.log(err);
						});
					}
					else {
						/* invitee won */
						model_lib.update_user_games(game.creator, "lost")
						.then(updated_creator => {
							model_lib.update_user_games(game.invitee, "won")
							.then(updated_invitee => {
								io.in(game_id).emit("game_over", username);
							}).catch(err => {
								console.log(err);
							});
						}).catch(err => {
							console.log(err);
						});
					}
				}).catch(err => {
					console.log(err);
				});
			}).catch(err => {
				console.log(err);
			});
		}
	});

	socket.on("join", function(user) {
		console.log(user.username, " is waiting");

		/* set my status to wait_join and store socket id */
		return models.users.update({
							status: "join_waiting",
							socket_id: socket.id }, {returning: true,
						where: {
							username: user.username } 
		}).then(update => {
			get_invitations(user.username)
			.then(invitations => {
				socket.emit("invitations", invitations);
			}).catch(err => {
				console.log(err);
			});
		}).catch(err => {
			console.log(err);
		});
	});

	socket.on("get_invitations", function(user) {
		get_invitations(user.username)
		.then(invitations => {
			socket.emit("invitations", invitations);
		}).catch(err => {
			console.log(err);
		});
	});

	/* invitee has accepted the game, notify the creator */
	socket.on("accept", function(game) {
		console.log("GAME ACCEPTED");
		console.log("creator is ", game.creator);

		/* update users' statuses */
		
		return models.users.update({
					status: "starting" }, {returning: true,
				where: {
					username: [game.creator, game.invitee]
				}
		}).then(updated => {
		
			console.log("updated statuses to starting");
			

			return models.games.update({
						status: "in_progress" }, {returning: true,
					where: {
						id: game.id } 
			}).then(update => {
				console.log("updated game to in progress");

				return models.users.findOne({
					where: {
						username: game.creator } 
				}).then(user => {
					io.to(user.socket_id).emit("game_accepted", game);
				}).catch(err => {
					console.log(err);
				});
			}).catch(err => {
				console.log(err);
			});

		}).catch(err => {
			console.log(err);
		});
	});

	socket.on("start_create", function(user) {
		return models.users.update({
							status: "creating",
							socket_id: socket.id }, {returning: true,
						where: {
							username: user.username } 
		}).then(update => {
			console.log("changed status");
		}).catch(err => {
			console.log(err);
		});
	});

	socket.on("create_game", function(game_info) {

		
		if (game_info["languages"] === "") {
			socket.emit("invalid");
		}
    else if (((!isNormalInteger(game_info["num_easy"])) || 
      (!isNormalInteger(game_info["num_moderate"]))) ||
      (!isNormalInteger(game_info["num_challenging"]))) {
      socket.emit("invalid");
    }
    else {
      var num_easy = parseInt(game_info["num_easy"]);
      var num_moderate = parseInt(game_info["num_moderate"]);
      var num_challenging = parseInt(game_info["num_challenging"]);

      if 
        ((((((num_easy < 0) ||  num_easy > 5) ||
          num_moderate < 0) ||  num_moderate > 5) ||
          num_challenging < 0) ||  num_challenging > 5) {
      	socket.emit("invalid");
      }
      else if (((num_easy == 0) && (num_moderate == 0)) && 
               (num_challenging == 0)) {
      	socket.emit("invalid");
      }
      else {

      	return model_lib.fetch_user(game_info["creator"])
      	.then(creator => {
      		if (!creator) {
      			socket.emit("invalid");
      		}
      		else {
						return model_lib.fetch_user(game_info["invitee"])
						.then(invitee => {
						 	if (!invitee) {
						     socket.emit("invalid");
						  }
						  else {
								return models.users.update({
													status: "create_waiting" }, {returning: true,
												where: {
													username: game_info["creator"] } 
								}).then(update => {

									var hash = crypto.createHash('md5').update(
										game_info["creator"] + game_info["invitee"] + moment().utc().format('hh:mm:ss'))
									.digest('hex');

									model_lib.fetch_random_puzzles('easy', num_easy)
									.then(easy_puzzles => {
										model_lib.fetch_random_puzzles('moderate', num_moderate)
										.then(moderate_puzzles => {
											model_lib.fetch_random_puzzles('challenging', num_challenging)
											.then(challenging_puzzles => {
												let puzzle_names = "";
												let puzzles = easy_puzzles.concat(moderate_puzzles.concat(challenging_puzzles));
												for (var i = 0; i < puzzles.length; i++) {
													if (i == 0) puzzle_names += puzzles[i].name;
													else puzzle_names += "," + puzzles[i].name;
												}
												console.log("puzzle_names", puzzle_names);


												/* store the game */
												return models.games.create({
															id: hash,
															creator: game_info["creator"],
															invitee: game_info["invitee"],
															status: "pending",
															languages: game_info["languages"],
															num_easy: parseInt(game_info["num_easy"]),
															num_moderate: parseInt(game_info["num_moderate"]),
															num_challenging: parseInt(game_info["num_challenging"]),
															puzzle_names: puzzle_names,
												}).then(game => {

													return models.users.findOne({
														where: {
															username: game_info["invitee"],
														}
													}).then(invitee => {
														/* if invitee status == "wait_join", emit message to their socket informing them
															 of the new game */
														if (invitee.status == "join_waiting") {
															io.to(invitee.socket_id).emit("invitation_update");
														}
														socket.emit("created");
													}).catch(err => {
														console.log(err);
													});
												}).catch(err => {
													console.log(err);
												});

											}).catch(err => {
												console.log(err);
											});
										}).catch(err => {
											console.log(err);
										});
									}).catch(err => {
										console.log(err);
									});
								}).catch(err => {
									console.log(err);
								});
					    }
					  }).catch(err => {
					    console.log(err);
					  });
					}
	     	}).catch(err => {
	     		console.log(err);
	     	});
			}
    }


	});

	socket.on('quit', function() {
		console.log("disconnecting..");
		socket.disconnect();
	});


	socket.on('disconnect', function() {
		/* if status == "wait_join" or status == "wait_create", change status to not waiting */
		console.log("executing disconnect");
		console.log("trying to find user with sock id", socket.id);


		return models.users.findOne({
			where: {
							socket_id: socket.id } 
		}).then(user => {
			console.log(user);
			if (user.status === "starting") {
				/* do nothing */
				console.log("disconnected to start game");
			}
			else if (user.status === "create_waiting") {
				/* destroy game */
				notify_invitee(user.username)
				.then(notified => {
					return models.games.destroy({
						where: {
							creator: user.username,
							status: "pending" }
					}).then(destroyed => {
						console.log("destroyed pending game");
						return models.users.update({
									status: "not_playing",
									socket_id: null }, {returning: true,
								where: {
									username: user.username } 
						}).then(update => {
							console.log("updated status to not playing");
						}).catch(err => {
							console.log(err);
						});

					}).catch(err => {
							console.log(err);
					});
				}).catch(err => {
						console.log(err);
				});
			}
			else if (user.status === "create_playing") {
				/* notify invitee that creator has left and destroy game */
				return models.games.findOne({
					where: {
						creator: user.username,
						status: "in_progress" }
				}).then(game => {
					io.in(game.id).emit("opponent_disconnect");
					return models.games.destroy({
						where: {
							id : game.id }
					}).then(destroyed => {
						return models.users.update({
									status: "not_playing",
									socket_id: null }, {returning: true,
								where: {
									username: user.username } 
						}).then(update => {
							console.log("creator left the game");
						}).catch(err => {
							console.log(err);
						});
					}).catch(err => {
						console.log(err);
					});
				}).catch(err => {
					console.log(err);
				});
			}

			else if (user.status === "join_playing") {
				/* notify creator that invitee has left */
				return models.games.findOne({
					where: {
						invitee: user.username,
						status: "in_progress" }
				}).then(game => {
					if (game) {
						io.in(game.id).emit("opponent_disconnect");
					}
					return models.users.update({
									status: "not_playing",
									socket_id: null }, {returning: true,
								where: {
									username: user.username } 
					}).then(update => {
						console.log("invitee left the game");
					}).catch(err => {
						console.log(err);
					});
				}).catch(err => {
					console.log(err);
				});

			}
			else if (user.status === "not_playing") {
				/* do nothing, game is over */
			}
			else {

				return models.users.update({
							status: "not_playing",
							socket_id: null }, {returning: true,
						where: {
							username: user.username } 
				}).then(update => {
					console.log("updated status to not playing");
				}).catch(err => {
					console.log(err);
				});
			}
		}).catch(err => {
			console.log(err);
		});
	});
});


async function get_invitations(username) {
	return models.games.findAll({
		raw: true,
		where: {
			invitee: username,
			status: "pending"
		},
		order: [['updatedAt', 'DESC']]
	});
}

async function notify_invitee(creator) {
	return models.games.findOne({
		where: {
			creator: creator,
			status: "pending" }
	}).then(game => {
		return models.users.findOne({
			where: {
				username: game.invitee } 
		}).then(invitee => {
			io.to(invitee.socket_id).emit("invitation_update");
		}).catch(err => {
			console.log(err);
		});
	}).catch(err => {
		console.log(err);
	});
}

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

module.exports = socket_api;