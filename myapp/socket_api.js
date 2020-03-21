const models = require('./models');
//var session = require('express-session');
var sequelize = require('sequelize');
var moment = require('moment');
var crypto = require('crypto');


var socket_io = require('socket.io');
var io = socket_io();
var socket_api = {};

socket_api.io = io;


/*
	users have three possible statuses: wait_join, wait_create, none */
/* add two fields to user table: status and socket_id */

io.on('connection', function(socket){
		console.log('A user connected');


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
		if (room.length !== 2) {
			io.in(game_id).emit("opponent_disconnect");
		}
	})

/*
	socket.on("submit_puzzle", function(username, puzzle_name, solution, language, time, length) {
		return models.solved_puzzles.findAll({
			where: {
				username: username,
				puzzle_name: puzzle_name,
			}
		}).then(solutions => {
			if (!solutions || solutions.length == 0) {
				update_user_solved(username, puzzle_name)
				.then(updated_user => {
					return models.solved_puzzles.create({
						username: username,
						puzzle_name: puzzle_name,
						solution: solution,
						time: time,
						length: length,
						language: language
					})
					.then(solution => {

						console.log(username + " unlocked " + puzzle_name);
						socket.emit("unlocked_puzzle", puzzle_name);

					}).catch(err => {
						console.log(err);
					});
				}).catch(err => {
					console.log(err);
				});
			}
			else {
				lang_solution_exists = false;
				for (var i = 0; i < solutions.length; i++) {
					if (solutions[i].language === language) {
						lang_solution_exists = true;
					}
				}
				if (lang_solution_exists) {
					// do nothing
				}
				else {
					// save solution
					update_user_solved(username, puzzle_name)
					.then(updated_user => {
						return models.solved_puzzles.create({
							username: username,
							puzzle_name: puzzle_name,
							solution: solution,
							time: time,
							length: length,
							language: language
						})
						.then(solution => {
							socket.emit("new_language", puzzle_name);
						}).catch(err => {
							console.log(err);
						});
					}).catch(err => {
						console.log(err);
					});
				}
			}
		}).catch(err => {
			console.log(err);
		});
	});
	*/

	socket.on("puzzle_solved", function(username, game_id, puzzle_name) {
		var room = io.sockets.adapter.rooms[game_id];
		if (room.length !== 2) {
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
		if (room.length !== 2) {
			io.in(game_id).emit("opponent_disconnect");			
		}
		else {
			/* set game status to completed */
			return models.games.update({
					status: "completed" }, {returning: true,
				where: { id: game_id } 
			}).then(game_updated => {
				return models.games.findOne({
					where: {id: game_id}
				}).then(game => {
					console.log("GAME", game);
					return models.users.update({
								status: "not_playing",
								socket_id: null }, {returning: true,
							where: {
								username: [game.creator, game.invitee]
							}
					}).then(updated => {
						/* creator won */
						if (username === game.creator) {
							update_user_games(game.creator, "won")
							.then(updated_creator => {
								update_user_games(game.invitee, "lost")
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
							update_user_games(game.creator, "lost")
							.then(updated_creator => {
								update_user_games(game.invitee, "won")
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
				socket.emit("invitations", invitations);//"You have an invitation from --- room number = ---");
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
			socket.emit("invitations", invitations);//"You have an invitation from --- room number = ---");
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

		return models.users.update({
							status: "create_waiting" }, {returning: true,
						where: {
							username: game_info["creator"] } 
		}).then(update => {

			var hash = crypto.createHash('md5').update(
				game_info["creator"] + game_info["invitee"] + moment().utc().format('hh:mm:ss'))
			.digest('hex');

			console.log("hash:", hash);
			console.log("hash type:", typeof hash);
			console.log("sock id type:", typeof socket.id);

			fetch_random_puzzles('easy', parseInt(game_info["num_easy"]))
			.then(easy_puzzles => {
				fetch_random_puzzles('moderate', parseInt(game_info["num_moderate"]))
				.then(moderate_puzzles => {
					fetch_random_puzzles('challenging', parseInt(game_info["num_challenging"]))
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
									time_easy: 0.0,
									time_moderate: 0.0,
									time_challenging: 0.0
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
			// if user status is starting basically don't do anything

			/*
			return models.users.update({
								status: "none",
								socket_id: null }, {returning: true,
							where: {
								socket_id: socket.id, } 
			}).then(update => {
				*/
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


				//update_user_status("not_playing", null);
			}
		}).catch(err => {
			console.log(err);
		});
			/*
			
		}).catch(err => {
			console.log(err);
		});
		*/
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
/*
	.then(games => {

				socket.emit("invitations", games);//"You have an invitation from --- room number = ---");
			}).catch(err => {
				console.log(err);
			});
			*/
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

/*
function update_user_status(username, new_status, new_socket) {



	return models.users.update({ status: new_status, socket_id: new_socket }, {
			where: { username: username }
	}).then(updated => {
		return updated;
	}).catch(err => {
		console.log(err);
	});
}

function update_game_status(id, new_status) {

	return models.games.update({ status: new_status }, {
			where: { id: id }
	}).then(updated => {
		return updated;
	}).catch(err => {
		console.log(err);
	});
}
*/


/*
socket_api.sendNotification = function() {
		io.sockets.emit('hello', {msg: 'Hello World!'});
}
*/
async function fetch_random_puzzles(difficulty, number) {

	console.log("fetching " + number + " random puzzles with difficulty " + difficulty);
	if (number == 0) {
		return [];
	}
	return models.puzzles.findAll({
		raw: true,
		where: {
			difficulty: difficulty
		}, 
		order: sequelize.fn('RAND'),
		limit: number
	});
}


function update_user_games(username, result) {

	return models.users.findOne({
			where : {
				username : username
			}
	})
	.then(user => {
		user.increment("games_played");
		if (result == "won") {
			user.increment("games_won");
		}
		else {
			user.increment("games_lost");
		}
	})
	.catch(err => {
		console.log(err);
	});
}

module.exports = socket_api;