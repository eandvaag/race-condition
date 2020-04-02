'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inputs', {

      puzzle_name: {
        type: Sequelize.STRING,
        references: {
          model: 'puzzles',
          key: 'name'
        }
      },
      test_num: {
        type: Sequelize.INTEGER
      },
      arg_num: {
        type: Sequelize.INTEGER
      },
      arg_type: {
        type: Sequelize.ENUM('int', 'bool', 'char', 'string', 'float',
                  'list-int', 'list-bool', 'list-char', 'list-string', 'list-float')
      },
      arg_val: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('inputs');
  }
};