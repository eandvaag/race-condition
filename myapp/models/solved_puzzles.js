'use strict';
module.exports = (sequelize, DataTypes) => {

  var solved_puzzles = sequelize.define('solved_puzzles', {
      username: {
        type: DataTypes.STRING,
        references: {
          model: 'users',
          key: 'username'
        }
      },
      puzzle_name: {
        type: DataTypes.STRING,
        references: {
          model: 'puzzles',
          key: 'name'
        }
      },
      language: {
        type: DataTypes.STRING
      },
      time: {
        type: DataTypes.FLOAT
      },
      length: {
        type: DataTypes.INTEGER
      },
      solution: {
        type: DataTypes.STRING(16000)
      }
  });
  return solved_puzzles;
}