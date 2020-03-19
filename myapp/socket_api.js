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


	socket.on("game_start", function(user, game_id) {
		
		return models.users.update({
							status: "playing",
							socket_id: socket.id }, {returning: true,
			where: {
				username: user.username } 
		}).then(update => {
			socket.join(game_id);
		}).catch(err => {
			console.log(err);
		})

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
					username: [game.creator, game.invitee] } 
		}).then(update => {
			console.log("updated statuses to playing");
			

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
			/* store the game */
			return models.games.create({
						id: hash,
						creator: game_info["creator"],
						invitee: game_info["invitee"],
						status: "pending",
						languages: game_info["languages"],
						num_easy: game_info["num_easy"],
						num_moderate: game_info["num_moderate"],
						num_challenging: game_info["num_challenging"],
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
				})
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
			invitee: username
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

module.exports = socket_api;