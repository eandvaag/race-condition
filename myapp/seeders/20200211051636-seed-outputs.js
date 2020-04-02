'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('outputs', [
    {
      puzzle_name: 'fibonacci',
      test_num: 0,
      ret_type: 'int',
      ret_val: '0',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 1,
      ret_type: 'int',
      ret_val: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 2,
      ret_type: 'int',
      ret_val: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 3,
      ret_type: 'int',
      ret_val: '5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 4,
      ret_type: 'int',
      ret_val: '55',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 5,
      ret_type: 'int',
      ret_val: '610',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      puzzle_name: 'sort',
      test_num: 0,
      ret_type: 'list-int',
      ret_val: '[1,2,3]',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'sort',
      test_num: 1,
      ret_type: 'list-int',
      ret_val: '[1,2,5,5,7]',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'sort',
      test_num: 2,
      ret_type: 'list-int',
      ret_val: '[]',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'sort',
      test_num: 3,
      ret_type: 'list-int',
      ret_val: '[15]',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      puzzle_name: 'is_palindrome',
      test_num: 0,
      ret_type: 'bool',
      ret_val: 'True',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 1,
      ret_type: 'bool',
      ret_val: 'False',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 2,
      ret_type: 'bool',
      ret_val: 'True',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 3,
      ret_type: 'bool',
      ret_val: 'True',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 4,
      ret_type: 'bool',
      ret_val: 'False',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 5,
      ret_type: 'bool',
      ret_val: 'True',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 6,
      ret_type: 'bool',
      ret_val: 'True',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      puzzle_name: 'char_count',
      test_num: 0,
      ret_type: 'int',
      ret_val: '3',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 1,
      ret_type: 'int',
      ret_val: '0',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 2,
      ret_type: 'int',
      ret_val: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 3,
      ret_type: 'int',
      ret_val: '8',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('outputs', null, {});
  }
};
