'use strict';
module.exports = (sequelize, DataTypes) => {

  var puzzles = sequelize.define('puzzles', {
      name: {
        primaryKey: true,
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING(5000)
      },
      difficulty: {
        type: DataTypes.ENUM('easy', 'moderate', 'challenging')
      }
  });
  return puzzles;
};