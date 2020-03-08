const models = require('../models');
var session = require('express-session');
var sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

/*
exports.get_landing = function(req, res, next) {
  res.render('landing', { title: 'Express' });
}

exports.submit_lead = function(req, res, next) {
  console.log("lead email:", req.body.lead_email);
  res.redirect('/form');
}
*/


exports.sessionChecker = function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
		res.redirect('/user');
	} else {
		next();
	}
}



exports.home = function(req, res, next) {
  res.render('home', { title: 'Home' });
}

exports.get_sign_up = function(req, res, next) {
  res.render('sign_up', { title: 'Sign Up' });
}

function isUsernameNew(username) {
	return models.users.count( { where: {
		username : username
	}}).then(count => {
		if (count == 0) {
			return true;
		}
		return false;
	});
}


/*
exports.show_user = function(req, res, next) {

	res.render('user', {res, res});
}
*/
function hasWhiteSpace(s) {
  return /\s/g.test(s);
}


exports.post_sign_up = function(req, res, next) {

	if (hasWhiteSpace(req.body.username) || hasWhiteSpace(req.body.password)) {
		res.redirect('/sign-up');
	}
	else {
		console.log("username", req.body.username);
		console.log("password", req.body.password);

		return models.users.create({
			username: req.body.username,
			password: req.body.password
		})
		.then(user => {
			req.session.user = user.dataValues;
			res.redirect('/user');
		})
		.catch(error => {
			console.log("error occured: ", error);
			res.redirect('/sign-up');
		})
	}
}


/*
exports.post_sign_up = function(req, res, next) {


	isUsernameNew(req.body.username).then(isNew => {
		if (isNew) {
			console.log("NEW USERNAME");
			console.log(req.body.username);
			return models.users.create({
				username: req.body.username,
				password: req.body.password
			}).then(users => {
				console.log(req.body.username);
				return models.users.findOne({
					where: {
						username: req.body.username
					}
				}).then(user => {
					console.log(user);
					//res.redirect('/user/' + req.body.username, {user, user});
					res.render('user', {user, user});
				});

				//res.redirect('user', {user : user });
			}).catch(function(err) {
				console.log(err);
			});
		}
		else {
			console.log('Username is already in use.');
			res.redirect('/');
		}
	});
}
*/



exports.get_sign_in = function(req, res, next) {
//res.render('sign_in', { title: 'Sign In' });
  res.render('sign_in', { title: 'Sign In' });
}


exports.post_sign_in = function(req, res, next) {
	return models.users.findOne({
		where: {
			username: req.body.username,
		}
	}).then(user => {
		if (!user) {
			console.log('no user found with that name')
			res.redirect('/sign-in');
		}
		else if (!user.validPassword(req.body.password)) {
			console.log('bad pass');
			res.redirect('/sign-in');
		}
		else {
			req.session.user = user.dataValues;
			res.redirect('/user');
		}
	})
}


/*
exports.post_sign_in = function(req, res, next) {
	return models.users.findOne({
		where : {
			username : req.body.username,
			password : req.body.password
		}
	}).then(user => {
		if (user==null) {
			//res.render('sign_in', { success: 'false'});
			console.log("bad user/pass");
		}
		else {
			//res.redirect('user', user);
			res.render('user', {user : user});
			//req = user;
			//return next();
			//res.render('user', { user : user });
		}
	}).catch(function(err) {
		console.log(err);
	});
}
*/
/*
exports.post_sign_in_json = function(req, res, next) {

	return models.users.



}
*/

exports.get_username = function(req, res, next) {

	console.log(req);
	return models.users.findOne({
		where : {
			username : req.params.username
		}
	}).then(user => {
		res.render('user', {user : user})
	}).catch(function(err) {
		console.log(err);
	})
}

exports.play = function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
		console.log(req.session.user);
		return models.games.findAll({})
			.then(games => {
				res.render('play', { title: 'Play' , user: req.session.user, games: games});
			})
			.catch(function(err) {
				console.log(err);
			})		
	}
	else {
		res.redirect('/sign-in');
	}
}

exports.get_create_game = function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
		console.log(req.session.user);
	//console.log(req);
	//res.render('play', {user : user});
		res.render('create_game', { title: 'Create Game' , user: req.session.user});
	}
	else {
		res.redirect('/sign-in');
	}
}


exports.play_post = function(req, res, next) {
/*
	console.log("LOG START");
	console.log(req.body);
*/
	res.redirect('/play');

}

exports.leaderboards = function(req, res, next) {

	/* return top 10 */
	/*
	users.findAll({
		order: [[Sequelize.col(score)]]
	})
	*/
	if (req.session.user && req.cookies.user_sid) {
		return models.users.findAll({
			raw: true,
			//plain: true,
			order: sequelize.literal('num_solved DESC'),
			limit: 10
		}).then(high_scorers => {
			console.log('high_scorers',high_scorers);
			res.render('leaderboards', { title: 'Leaderboards', user: req.session.user, high_scorers : high_scorers });
		}).catch(function(err) {
			console.log(err);
		})
	}
	else {
		res.redirect('/sign-in');
	}
}


exports.get_user = function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
		console.log(req.session.user);
		return models.solved_puzzles.findAll({
			raw: true,
			where: {
				username: req.session.user.username
			}
		}).then(puzzles => {
			//console.log(puzzles);
			var lang_lookup = create_lang_lookup(puzzles);
			//console.log(u_puzzles);

			res.render('user', { title: 'User', user: req.session.user, puzzles: puzzles, lang_lookup : lang_lookup});
		}).catch(function(err) {
			console.log(err);
		})
		
		//res.render('user', {user: req.session.user});
	}
	else {
		res.redirect('/sign-in');
	}
}

function create_lang_lookup(puzzles) {
	var lookup = {};
	//var found_names = [];

	for (var i = 0; i < puzzles.length; i++) {
		console.log(puzzles[i]);
		if (!(puzzles[i].puzzle_name in lookup)) {
			//found_names.push(puzzles[i].puzzle_name);
			//console.log(puzzle.puzzle_name);
			lookup[puzzles[i].puzzle_name] = [puzzles[i].language];
		}
		else {
			lookup[puzzles[i].puzzle_name].push(puzzles[i].language);
		}
	}
	return lookup;
}

exports.logout = function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
		res.clearCookie('user_sid');
		res.redirect('/');
	}
	else {
		res.redirect('/sign-in');
	}
}

/*
exports.get_user = function(req, res, next) {

	return models.puzzles.findAll().then(puzzles => {
		res.render('user', { title: 'User', puzzles: puzzles});
	})
	
/*
	return models.users.findAll({
		where: {
			username: req.params.username
		}, include [ {model: puzzles, as "Puzzles"}]
	}).then(user_puzzles => {
		res.render('user', {title: 'User', user: user, user_puzzles : user_puzzles})
	})
*/
//}


exports.show_puzzle = function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
		console.log(req.session.user);
		console.log(req.params.puzzle_name);
		return models.puzzles.findOne({
			where : {
				name: req.params.puzzle_name
			}
			
		}).then(puzzle => {
			get_fastest_solutions(req.params.puzzle_name)
			.then(fastest_solutions => {
				get_shortest_solutions(req.params.puzzle_name)
				.then(shortest_solutions => {
					res.render('puzzle', { user: req.session.user, puzzle: puzzle,
											fastest_solutions: fastest_solutions, 
											shortest_solutions: shortest_solutions});
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


			/*
		return models.users.findAll({
			raw: true,
			//plain: true,
			order: sequelize.literal('num_solved DESC'),
			limit: 10
		}).then(high_scorers => {
			


			return models.solved_puzzles.findAll({
				raw: true,
				where: {
					puzzle_name: req.params.puzzle_name
				},
				order: sequelize.literal('time ASC'),
				limit: 10
			}).then(solutions => {
				res.render('puzzle', { user: req.session.user, puzzle: puzzle, solutions: solutions});
			}).catch(function(err) {
				console.log(err);
			});	
		}).catch(function(err) {
			console.log(err);
		});
		*/
	else {
		res.redirect('/sign-in');
	}
}

async function get_fastest_solutions(puzzle_name) {
	console.log('getting fastest solutions');
	console.log('puzzle_name is', puzzle_name);
	return models.solved_puzzles.findAll({
		raw: true,
		where: {
			puzzle_name: puzzle_name
		},
		order: sequelize.literal('time ASC'),
		limit: 10
	});
}

async function get_shortest_solutions(puzzle_name) {
	console.log('getting shortest solutions');
	return models.solved_puzzles.findAll({
		raw: true,
		where: {
			puzzle_name: puzzle_name
		},
		order: sequelize.literal('length ASC'),
		limit: 10
	});
}

async function get_user_solutions(username, puzzle_name) {
	return models.solved_puzzles.findAll({
				raw: true,
				where: {
					username: username,
					puzzle_name: puzzle_name
		}
	});/*.then(solutions => {
		console.log("get_user_solutions", solutions);
		return solutions;
	}).catch(function(err) {
		console.log(err);
	});
	*/
}

exports.get_work_on = function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
		console.log(req.session.user);
		return models.puzzles.findOne({
			where : {
				name: req.params.puzzle_name
			}
		}).then(puzzle => {
			get_user_solutions(req.session.user.username, req.params.puzzle_name)
			.then(solutions => {
				console.log(solutions);
				res.render('work_on', { title: 'Work on it', user: req.session.user, puzzle: puzzle, solutions: solutions});
			})
			
		}).catch(function(err) {
			console.log(err);
		});
	}
	else {
		res.redirect('/sign-in');
	}
}

exports.work_on_submit = function(req, res, next) {
	var data = {};
	if (req.session.user && req.cookies.user_sid) {
		return models.solved_puzzles.findOne({
			where: {
				username: req.session.user.username,
				puzzle_name: req.params.puzzle_name,
				language: req.body.language
			}
		}).then(solution => {
			if (!solution) {
				return models.solved_puzzles.create({
					username: req.session.user.username,
					puzzle_name: req.params.puzzle_name,
					solution: req.body.solution,
					time: req.body.time,
					length: req.body.length,
					language: req.body.language
				})
				.then(solution => {
					get_user_solutions(req.session.user.username, req.params.puzzle_name)
					.then(solutions => {
						data.solutions = solutions;
						data.redirect = null;
						res.json(data);
					})
				})
				.catch(function(err) {
					console.log(err);
				});
			} else {
				return models.solved_puzzles.update({
					solution: req.body.solution,
					time: req.body.time,
					length: req.body.length }, {returning: true,
				where: {
					username: req.session.user.username,
					puzzle_name: req.params.puzzle_name,
					language: req.body.language } }
				).then(solution => {
					get_user_solutions(req.session.user.username, req.params.puzzle_name).
					then(solutions => {
						data.solutions = solutions;
						data.redirect = null;
						res.json(data);
					})
				})
				.catch(function(err) {
					console.log(err);
				});
			}
		})
		.catch(function(err) {
			console.log(err);
		});
	} else {
		data.redirect = '/sign-in';
		console.log("redirecting");
		res.json(data);
	}
}

exports.post_work_on = function(req, res, next) {
	console.log('got form');
	console.log(req.body);
	console.log(req.body.lang);
	let cmd;
	let ext;
	let head;
	let data = {};


	if (req.session.user && req.cookies.user_sid) {
		if (req.body.lang === "Python") {
			cmd = "python3";
			ext = "py";
			head = "";
		}
		else if (req.body.lang === "Scheme") {
			cmd = "racket";
			ext = "rkt";
			head = "#lang racket\n\n(provide " + req.params.puzzle_name + ")\n\n";
		}
		else if (req.body.lang === "JavaScript") {
			cmd = "node";
			ext = "js";
			head = "exports." + req.params.puzzle_name + " = ";
		}
		else if (req.body.lang === "Haskell") {
			cmd = "runhaskell -i./tests/user/" + req.session.user.username + ':./tests/puzzle';
			ext = "hs";
			head = "module UserFun where\nuserFun = " + req.params.puzzle_name + "\n";
			head = "module UserFun where\n" + 

"wordsWhen :: (Char -> Bool) -> String -> [String]\n"+
"wordsWhen p s =  case dropWhile p s of\n"+
                      "  \"\" -> []\n"+
                      "  s' -> w : wordsWhen p s''\n"+
                            "    where (w, s'') = break p s'\n"+



			"intArg a = (read a :: Integer)\n" +
"listIntArg a = map intArg (listStringArg a)\n" +
"charArg a = a !! 0\n"+
"listCharArg a = map charArg (listStringArg a)\n"+
"stringArg a = a\n"+
"listStringArg a = wordsWhen (== ',') a\n"+
"floatArg a = (read a :: Float)\n"+
"listFloatArg a = map floatArg (listStringArg a)\n"+
"boolArg a = a == \"true\"\n"+
"listBoolArg a = map boolArg (listStringArg a)\n\n"+
"userFun ";

			const lineByLine = require('n-readlines');
			const liner = new lineByLine(path.join("tests", "puzzle", req.params.puzzle_name + ".txt"));

			let line;

			let test_count = parseInt(liner.next().toString('ascii'));
			let arg_count = parseInt(liner.next().toString('ascii'));

			let argt = [];
			for (var i = 0; i < arg_count; i++) {
				argt.push(liner.next().toString('ascii'));
			}

			let ret_type = liner.next().toString('ascii');
			for (var i = 0; i < 4; i++) {
				head = head + "a" + i.toString() + " ";
			}

			let lookup = {
				"int": "intArg",
				"list-int": "listIntArg",
				"char": "charArg",
				"list-char": "listCharArg",
				"string": "stringArg",
				"list-string": "listStringArg",
				"float": "floatArg",
				"list-float": "listFloatArg",
				"bool": "boolArg",
				"list-bool": "listBoolArg"
			};

			head = head + "r = if (" + req.params.puzzle_name + " ";
			for (var i = 0; i < arg_count; i++) {
				head = head + "(" + lookup[argt[i]] + " a" + i.toString() + ")";
			}
			head = head + ") == (" + lookup[ret_type] + " r)\n" +
			"  then 1\n" + 
			"  else 0\n";
		}
		console.log("GOT HERE");
		console.log(req.session.user.username);

		let filename = path.join('tests', 'user', req.session.user.username, 'UserFun.' + ext);
		console.log("USER FILE:", filename);
		let test_harness = path.join('tests', 'lang', 'test.' + ext);
		let time_exp = path.join('tests', 'user', req.session.user.username, 'time_exp');
		let time_tot = path.join('tests', 'user', req.session.user.username, 'time_tot');
		let cmd_error = path.join('tests', 'user', req.session.user.username, 'cmd_error');
		
		console.log("HARNESS:", test_harness);

		fs.writeFile(filename, head, (err) => {
			if (err) throw err;
			fs.appendFile(filename, req.body.user_fun, (err) => {
				if (err) throw err;
			})
		});



	/*
		fs.writeFile(filename, req.body.user_fun, (err) => {
			if (err) throw err;
		});
		*/


		/* append test harness to file containing user's function */
	/*

		fs.readFile(test_harness, (err, data) => {
			if (err) throw err;
			fs.appendFile(filename, data, (err) => {
				if (err) throw err;
			});
		});
		*/
		//let timefile = path.join('tests', 'user', req.session.user.username, 'time');

		let full_cmd = 'timeout 5s /usr/bin/time -o ' + time_exp + ' --format "%U+%S" ' + cmd + ' ' + test_harness + ' ' 
		+ req.params.puzzle_name + ' ' + req.session.user.username + '; echo $? >' + cmd_error +' ; tail -1 ' + time_exp + ' | bc >' + time_tot;
		console.log("EXECUTING:", full_cmd);


		//result = run_tests(filename, language, req.params.puzzle_name);


		const { exec } = require('child_process');
		const result = exec(full_cmd, {shell: "/bin/bash"}, function (error, stdout, stderr) {
			if (error) {
				console.log(error.stack);
				console.log('Error code: '+error.code);
				console.log('Signal received: '+error.signal);
				//data.timeout = (error.code == 124 || error.code == 137);
			}
			/*
			else {
				data.timeout == false;
			}
			*/
			fs.readFile(cmd_error, 'utf8', (err, exec_error) => {
				if (err) throw err;
				data.timeout = (parseInt(exec_error) == 124);
				
			
				console.log('Child Process STDOUT: '+stdout);
				console.log('Child Process STDERR: '+stderr);

				//return stderr;
				data.redirect = null;


				//data.timeout = 


				data.passed_all = (stdout == "All tests passed!\n");
				console.log(data.passed_all);

				let pattern = new RegExp("^Number of tests passed: [0-9][0-9]* out of [0-9][0-9]*\n$");
				if (stdout !== "All tests passed!\n" && !(pattern.test(stdout))) {
					data.stdout = "Printing to stdout is not allowed. Sorry!\n";
				}
				else {
					data.stdout = stdout;

				}
				
				/*
				console.log((stdout == "All tests passed!"));

				if (data.passed_all) {
					data.stdout = stdout;
				}
				else {
					let pattern = new RegExp("Number of tests passed: [0-9][0-9]* out of [0-9][0-9]*\n");

					let match = stdout.match(pattern);
					if (match)
						data.stdout = match[0];
					else
						data.stdout = "";
				}
				*/
				data.stderr = stderr;
				//data.res = stdout + stderr;
				data.length = req.body.user_fun.length;
				fs.readFile(time_tot, 'utf8', (err, time) => {
					if (err) throw err;
					data.time = time;
					res.json(data);
				});
			});
		});
	}
	else {
		data.redirect = '/sign-in';
		data.res = "";
		data.time = "";
		console.log("redirecting");
		res.json(data);
	}


/*
	console.log("result stderr", result);
	res.json(result);
*/





	//res.redirect('/puzzle/' + req.params.puzzle_name + '/' + req.params.username);
}



function run_tests(filename, language, function_name) {
/*
	var sh = require('execSync');

	var result = sh.exec(language + " " + filename + " " + function_name);
	console.log('return code ' + result.code);
	console.log('stdout + stderr ' + result.stdout);
*/
/*
	var res = require('child_process').execSync(language + " " + filename + " " + function_name, {stdio:[0,1,2]}, function(error, stdout, stderr) {
		if (error) {
			console.log(error);
		}
		console.log('Child Process STDOUT: '+stdout);
		console.log('Child Process STDERR: '+stderr);
	});
	console.log(res[2]);
	
	return res[2];
*/

	
	//const execSync = require('child_process').execSync;
/*
	return new Promise((resolve, reject) => {
		exec(language + " " + filename + " " + function_name, (err, stdout, stderr) => {
			if (error) {
				console.log(error.stack);
				console.log('Error code: '+error.code);
				console.log('Signal received: '+error.signal);				
			}
			resolve(stdout? stdout : stderr)
		});
	});
	*/
	

	console.log("RESULT:", res);
	return res;
	
	
/*
	res.on('exit', function (code) {
		console.log('Child process exited with exit code '+code);
	});

	return [stdout, stderr];
*/

}

/*
	console.log(req.body);
	return models.users.findOne({
		where : {
			username : req.body.username
		}
	}).then(user => {
		res.render('user', { user : user });
	})
*/


/*
	return models.users.create({
		username: req.body.username,
		password: req.body.password
	}).then(users => {
		res.redirect('/');
	})
*/
	
	//let db = require('../database/connect');
	//let my_sql = '';

	//res.redirect('/');

/*
exports.sign_in = function(req, res, next) {

	return models.users.findOne({
		where : {
			username : req.body.username
		}
	}).then(user => {
		res.render('/user', { user : user });
	})

}
*/



/*
exports.update_num_solved = function(req, res, next) {

	//req.params.username;
	//req.body.new_score;
	return models.users.increment({
		'num_solved': 1
	}, where: {
		username: req.body.username
	}).then(result => {

	})


}
*/


//exports 
/*
exports.test = function(req, res, next) {
	res.render('test', { title: 'Test'});
}
*/
/*
exports.get_form =  function(req, res, next) {
	res.render('form');
}

exports.post_form = function(req, res, next) {
	console.log(req.body);
	//res.send("received your request!");
	res.redirect('/form');
}
*/
