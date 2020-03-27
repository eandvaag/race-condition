
const models = require('./models');
var sequelize = require('sequelize');


exports.fetch_random_puzzles = function (difficulty, number) {

  console.log("fetching " + number + " random puzzles with difficulty " + difficulty);

  return models.puzzles.findAll({
    raw: true,
    where: {
      difficulty: difficulty
    }, 
    order: sequelize.fn('RAND'),
    limit: number
  });
}

exports.update_user_games = function(username, result) {

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