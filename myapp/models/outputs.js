'use strict';
module.exports = (sequelize, DataTypes) => {

  var outputs = sequelize.define('outputs', {
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
      ret_type: {
        type: DataTypes.ENUM('int', 'bool', 'char', 'string', 'float',
                  'list-int', 'list-bool', 'list-char', 'list-string', 'list-float')
      },
      ret_val: {
        type: DataTypes.STRING
      }
  });
  return outputs;
};