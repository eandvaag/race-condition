const models = require('../models');
var session = require('express-session');
var sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const lineByLine = require('n-readlines');

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


exports.new = function(req, res, next) {
  res.render('new', { title: 'Home' });
}

exports.home = function(req, res, next) {
  res.render('home', { title: 'Home' });
}

exports.get_sign_up = function(req, res, next) {
  res.render('sign_up', { title: 'Sign Up' });
}


function valid_username(username) {
  let pattern = new RegExp("^[a-zA-Z0-9_]{4,}$");
  return pattern.test(username);
}


function valid_password(password) {
  let pattern = new RegExp("^(?=.*[A-Z]){1,}(?=.*[0-9]){1,}(?=.*[@$!%*#?&]){1,}[A-Za-z0-9@$!%*#?&]{8,}$");
  return pattern.test(password);

}

exports.post_sign_up = function(req, res, next) {
  response = {};
  response.bad_username = false;
  response.bad_password = false;
  response.username_taken = false;
  response.error = false;
  response.redirect = null;

  console.log("username", req.body.username);
  console.log("password", req.body.password);

  if (!(valid_username(req.body.username))) {
    console.log("bad username");
    response.bad_username = true;
    res.json(response);
  }
  else if (!(valid_password(req.body.password))) {
    console.log("bad pass");
    response.bad_password = true;
    res.json(response);
  }
  else {
    console.log("checking uniqueness...");
    return models.users.findOne({
      where: {
        username: req.body.username,
      }
    }).then(token => {
      if (token) {
        console.log("username taken");
        response.username_taken = true;
        res.json(response);
      }
      else {

        console.log("username is unique");
        return models.users.create({
          username: req.body.username,
          password: req.body.password
        })
        .then(user => {
          /* create the test directory for this user */
          fs.mkdirSync(path.join('tests', 'user', req.body.username), { recursive: true }, (error) => {
            if (error) {
              console.log(error);
            }
          });
          req.session.user = user.dataValues;
          response.redirect = "/user";
          res.json(response);
          //res.redirect('/user');

        })
        .catch(error => {
          console.log(error);
          response.error = true;
          res.json(response);
        });
      }
    }).catch(error => {
      console.log(error);
      response.error = true;
      res.json(response);
    });
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
  response = {};
  response.not_found = false;
  response.error = false;


  return models.users.findOne({
    where: {
      username: req.body.username,
    }
  }).then(user => {
    if (!user) {
      response.not_found = true;
      res.json(response);
      console.log('no user found with that name')
      //res.redirect('/sign-in');
    }
    else {
      if (!user.check_password(req.body.password)) {
        response.not_found = true;
        res.json(response);
      }
      else {
        console.log("redirect");
        req.session.user = user.dataValues;
        response.redirect = "/user";
        res.json(response);
      }
      //console.log('bad pass');
      //res.redirect('/sign-in');
    }
    //else {
    //  req.session.user = user.dataValues;
    //  res.redirect('/user');
    //}
  }).catch(error => {
    console.log(error)
    response.error = true;
    res.json(response);
  });
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
/*
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
*/

exports.play = function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    fetch_usernames()
    .then(usernames => {
      res.render('play', { title: 'Play' , user: req.session.user, usernames: usernames});
    })
    .catch(err => {
      console.log(err);
    });    
  }
  else {
    res.redirect('/sign-in');
  }
}
/*
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
*/

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


async function fetch_user(username) {
  return models.users.findOne({
      where : {
        username : username
      }
    })
    .then(user => {
      return user;
    })
    .catch(err => {
      console.log(err);
    });
}

exports.verify_user = function(req, res, next) {
  data = {};
  data.not_found = false;

  return fetch_user(req.body.username)
  .then(user => {
    if (user) {
      res.json(data);
    }
    else {
      data.not_found = true;
      res.json(data);
    }
  }).catch(err => {
    console.log(err);
  });
}

exports.get_game = function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    return models.games.findOne({
      where: {
        id: req.params.game_id
      }
    }).then(game => {
      if (!game) {
        console.log("VERY BAD");
      }
      if (req.session.user.username === game.creator || req.session.user.username === game.invitee) {
        fetch_random_puzzles('easy', game.num_easy)
        .then(easy_puzzles => {
          fetch_random_puzzles('moderate', game.num_moderate)
          .then(moderate_puzzles => {
            fetch_random_puzzles('challenging', game.num_challenging)
            .then(challenging_puzzles => {
              console.log("easy_puzzles:", easy_puzzles);
              res.render('game', { game: game, user: req.session.user, 
                          easy_puzzles: easy_puzzles, moderate_puzzles: moderate_puzzles,
                          challenging_puzzles: challenging_puzzles});

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
      else {
        res.redirect("/sign-in");
      }
    }).catch(err => {
      console.log(err);
    });
  }
  else {
    res.redirect('/sign-in');
  }
}


async function fetch_random_puzzles(difficulty, number) {

  console.log("fetching " + number + " random puzzles with difficulty " + difficulty);
  if (number == 0) {
    return [];
  }
  else {
    return models.puzzles.findAll({
      raw: true,
      where: {
        difficulty: difficulty
      }, 
      order: sequelize.fn('RAND'),
      limit: number
    });
  }/*
  .then(puzzles => {
      return puzzles;
    }).catch(err => {
      console.log(err);
    });
    */
}


async function fetch_puzzle(puzzle_name) {
    return models.puzzles.findOne({
      where : {
        name: puzzle_name
      }
      
    }).then(puzzle => {
      return puzzle;
    }).catch(err => {
      console.log(err);
    });
}

exports.get_user = function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    console.log(req.session.user);



    fetch_user(req.session.user.username)
      .then(user => {
        return models.solved_puzzles.findAll({
          raw: true,
          where: {
            username: req.session.user.username
          }
        }).then(puzzles => {
          //console.log(puzzles);
          var lang_lookup = create_lang_lookup(puzzles);

          let cur_rank = calc_rank(user);
          if (user.rank !== cur_rank) {
            new_rank = true;
            return models.users.update({
              rank: cur_rank }, {returning: true,
            where: {
              username: req.session.user.username } })
            .then(update => {
              fetch_user(req.session.user.username)
              .then(updated_user => {
                res.render('user', { title: 'User', user: updated_user, puzzles: puzzles, lang_lookup : lang_lookup, new_rank: new_rank});
              })
              .catch(err => {
                console.log(err);
              })
            })
            .catch(err => {
              console.log(err);
            });
          }
          else {
            new_rank = false;
            res.render('user', { title: 'User', user: user, puzzles: puzzles, lang_lookup : lang_lookup, new_rank: new_rank});
          }

        })
        //console.log("got this user:", user);
        
          //console.log(u_puzzles);

          /* get most up-to-date rank information */
          

          //res.render('user', { title: 'User', user: user, puzzles: puzzles, lang_lookup : lang_lookup, new_rank: new_rank});
        .catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        console.log(err);
      })
    //}).catch(err => {
    //  console.log(err);
    //});
    //res.render('user', {user: req.session.user});
  }
  else {
    res.redirect('/sign-in');
  }
}

function create_lang_lookup(puzzles) {
  var lookup = {};

  for (var i = 0; i < puzzles.length; i++) {
    console.log(puzzles[i]);
    if (!(puzzles[i].puzzle_name in lookup)) {
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

exports.show_puzzle = function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    console.log(req.session.user);
    console.log(req.params.puzzle_name);


    fetch_puzzle(req.params.puzzle_name)
    .then(puzzle => {
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

function calc_rank(user) { 
let score = (user.games_played) + (user.num_easy_solved) + (user.num_moderate_solved * 4) + (user.num_difficult_solved * 8);

let cur_rank;
    if (score < 1) {
      cur_rank = "Newbie";
    } else if (score >= 1 && score < 10) {
      cur_rank = "Wannabe";
    } else if (score >= 10 && score < 20) {
      cur_rank = "Code Grinder";
    } else if (score >= 20 && score < 30) {
      cur_rank = "Terminal Junkie";
    } else if (score >= 30 && score < 40) {
      cur_rank = "Code Monkey";
    } else if (score >= 40 && score < 50) {
      cur_rank = "Real Programmer";
    } else if (score >= 50 && score < 60) {
      cur_rank = "Language Lawyer";
    } else if (score >= 60 && score < 80) {
      cur_rank = "Hacker";
    } else if (score >= 80 && score < 100) {
      cur_rank = "Cowboy";
    } else if (score >= 100 && score < 130) {
      cur_rank = "Kahuna";
    } else if (score >= 130 && score < 170) {
      cur_rank = "Super Programmer";
    } else if (score >= 170 && score < 220) {
      cur_rank = "Guru";
    } else if (score >= 220 && score < 280) {
      cur_rank = "Wizard";
    } else {
      cur_rank = "Demi-god";
    }
  return cur_rank;

}
/*
async function update_rank(username) {
  info = {};

  console.log("UPDATE RANK");
  fetch_user(username)
  .then(user => {
    console.log("GOT USER");
    let cur_rank = calc_rank(user);
    let score = (user.games_played) + (user.num_easy_solved) + (user.num_moderate_solved * 4) + (user.num_difficult_solved * 8);
    let saved_rank = user.rank;

    if (cur_rank !== saved_rank) {
      console.log("DIFFERENT!!");
      return true;

      return models.users.update({
        rank: cur_rank }, {returning: true,
      where: {
        username: username } }
      ).then(updated_user => {
        return true;
      }).catch(err => {
        console.log(err);
      });

      
    }
    else {
      return false;
    }
  }).catch(err => {
    console.log(err);
  });
}

*/
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
      
    }).catch(err => {
      console.log(err);
    });
  }
  else {
    res.redirect('/sign-in');
  }
}

async function fetch_usernames() {
  return models.users.findAll({
    raw: true,
    attributes: ['username']
  }).then(usernames => {
    console.log(usernames);
    return usernames.map(a => a.username);
  }).catch(err => {
    console.log(err);
  });
}


function update_user_solved(username, puzzle_name) {

  return models.users.findOne({
      where : {
        username : username
      }
    })
    .then(user => {
      models.puzzles.findOne({
        where : {
          name : puzzle_name
        }
      })
      .then(puzzle => {
        if (puzzle.difficulty == "easy") {
          user.increment("num_easy_solved");
        } 
        else if (puzzle.difficulty == "moderate") {
          user.increment("num_moderate_solved");
        }
        else {
          user.increment("num_difficult_solved");
        }
      })
      .catch(err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
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
        /* add to user score */
        /* increment num 'difficulty' solved */
        update_user_solved(req.session.user.username, req.params.puzzle_name)
        .then(updated_user => {
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
            .catch(err => {
              console.log(err);
            });
          })
          .catch(err => {
            console.log(err);
          });
        })
        .catch(err => {
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


exports.run_code = function(req, res, next) {
  console.log('got form');
  console.log(req.body);
  console.log(req.body.lang);
  let compile;
  let cmd;
  let ext;
  let head;
  let data = {};
  let rm = "";

  if (req.session.user && req.cookies.user_sid) {
    if (req.body.lang === "Python") {
      compile = "python3 -m py_compile";
      //rm = "rm ./tests/user/" + req.session.user.username + "/UserFun.pyc";
      cmd = "docker exec rc-python python3";
      ext = "py";
      head = "";
    }
    else if (req.body.lang === "Scheme") {
      compile = "raco make";
      cmd = "docker exec rc-racket racket";
      rm = "rm -rf ./tests/user/" + req.session.user.username + "/compiled";
      ext = "rkt";
      head = "#lang racket\t(provide " + req.body.puzzle_name + ")\t";
    }
    else if (req.body.lang === "JavaScript") {
      compile = "node --check";
      cmd = "docker exec rc-node node";
      ext = "js";
      /* use the name as entered by the user so that the user needs to give the correct
         function name */ 
      let user_puzzle_name = req.body.user_fun.split(' ')[1].split('(')[0];
      head = "exports." + user_puzzle_name + " = ";
    }
    else if (req.body.lang === "Haskell") {
      compile = "ghc -e";
      cmd = "docker exec rc-haskell runhaskell -i./tests/user/" + req.session.user.username + ':./tests/puzzle';
      ext = "hs";
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

      
      const liner = new lineByLine(path.join("tests", "puzzle", req.body.puzzle_name + ".txt"));

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

      head = head + "r = if (" + req.body.puzzle_name + " ";
      for (var i = 0; i < arg_count; i++) {
        head = head + "(" + lookup[argt[i]] + " a" + i.toString() + ")";
      }
      head = head + ") == (" + lookup[ret_type] + " r)\n" +
      "  then 1\n" + 
      "  else 0\n";
    }
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

    let full_compile;
    if (req.body.lang === "Haskell") {
      full_compile = compile + ' "' + req.body.user_fun + '"';
    }
    else {
      full_compile = compile + ' ' + filename + "; " + rm;
    }


    let full_cmd = 'timeout 5s /usr/bin/time -o ' + time_exp + ' --format "%U+%S" ' + cmd + ' ' + test_harness + ' ' 
    + req.body.puzzle_name + ' ' + req.session.user.username + '; echo $? >' + cmd_error +' ; tail -1 ' + time_exp + ' | bc >' + time_tot;
    console.log("EXECUTING:", full_cmd);

    //full_compile = "ls";

    const { exec } = require('child_process');

    console.log("error check...");
    const result = exec(full_compile, {shell: "/bin/bash"}, function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }

      if (stderr !== "") {
        data.timeout = false;
        data.stderr = stderr;
        res.json(data);
      }
      else {
        /* user's function passed error-checking stage */


        const result = exec(full_cmd, {shell: "/bin/bash"}, function (error, stdout, stderr) {
          if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
          }
          fs.readFile(cmd_error, 'utf8', (err, exec_error) => {
            if (err) throw err;
            data.timeout = (parseInt(exec_error) == 124);
            
          
            console.log('Child Process STDOUT: '+stdout);
            console.log('Child Process STDERR: '+stderr);

            data.redirect = null;

            data.passed_all = (stdout == "All tests passed!\n");
            console.log(data.passed_all);

            let pattern = new RegExp("^Number of tests passed: [0-9][0-9]* out of [0-9][0-9]*\n$");
            if (stderr !== "" || (stdout !== "All tests passed!\n" && !(pattern.test(stdout)))) {
              data.error = true;
              data.stdout = "There are still errors in your code!"+
              "\n\nRemember that your function is not allowed to\ngenerate output.\n";
            }
            else {
              data.error = false;
              data.stdout = stdout;

            }

            data.stderr = "";

            data.length = req.body.user_fun.length;
            fs.readFile(time_tot, 'utf8', (err, time) => {
              if (err) throw err;
              data.time = time;
              res.json(data);
            });
          });
        });
      }
    });



  }
  else {
    data.redirect = '/sign-in';
    data.res = "";
    data.time = "";
    console.log("redirecting");
    res.json(data);
  }
}


/*
exports.create_game = function(req, res, next) {
  let data = {};

  if (req.session.user && req.cookies.user_sid) {


  }
  else {
    data.redirect = "/sign-in";
    res.json(data);
  }
  */