'use strict';
module.exports = (sequelize, DataTypes) => {

  var inputs = sequelize.define('inputs', {
      puzzle_name: {
        type: DataTypes.STRING,
        references: {
          model: 'puzzles',
          key: 'name'
        }
      },
      test_num: {
        type: DataTypes.INTEGER
      },
      arg_num: {
        type: DataTypes.INTEGER
      },
      arg_type: {
        type: DataTypes.ENUM('int', 'bool', 'char', 'string', 'float',
                   'list-int', 'list-bool', 'list-char', 'list-string', 'list-float')
      },
      arg_val: {
        type: DataTypes.STRING
      }
  });
  return inputs;
};


