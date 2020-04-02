'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('solved_puzzles', {
      username: {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'username'
        }
      },
      puzzle_name: {
        type: Sequelize.STRING,
        references: {
          model: 'puzzles',
          key: 'name'
        }
      },
      language: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.FLOAT
      },
      length: {
        type: Sequelize.INTEGER
      },
      solution: {
        type: Sequelize.STRING(16000)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('solved_puzzles');
  }
};