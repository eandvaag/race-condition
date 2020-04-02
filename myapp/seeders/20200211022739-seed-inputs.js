'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('inputs', [
    {
      puzzle_name: 'fibonacci',
      test_num: 0,
      arg_num: 0,
      arg_type: 'int',
      arg_val: '0',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 1,
      arg_num: 0,
      arg_type: 'int',
      arg_val: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 2,
      arg_num: 0,
      arg_type: 'int',
      arg_val: '2',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 3,
      arg_num: 0,
      arg_type: 'int',
      arg_val: '5',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 4,
      arg_num: 0,
      arg_type: 'int',
      arg_val: '10',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'fibonacci',
      test_num: 5,
      arg_num: 0,
      arg_type: 'int',
      arg_val: '15',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      puzzle_name: 'sort',
      test_num: 0,
      arg_num: 0,
      arg_type: 'list-int',
      arg_val: '[3,1,2]',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'sort',
      test_num: 1,
      arg_num: 0,
      arg_type: 'list-int',
      arg_val: '[1,5,2,7,5]',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'sort',
      test_num: 2,
      arg_num: 0,
      arg_type: 'list-int',
      arg_val: '[]',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'sort',
      test_num: 3,
      arg_num: 0,
      arg_type: 'list-int',
      arg_val: '[15]',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'sort',
      test_num: 4,
      arg_num: 0,
      arg_type: 'list-int',
      arg_val: '[1,2,3]',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      puzzle_name: 'is_palindrome',
      test_num: 0,
      arg_num: 0,
      arg_type: 'string',
      arg_val: 'tenet',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 1,
      arg_num: 0,
      arg_type: 'string',
      arg_val: 'example',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 2,
      arg_num: 0,
      arg_type: 'string',
      arg_val: 'racecar',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 3,
      arg_num: 0,
      arg_type: 'string',
      arg_val: 'stats',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 4,
      arg_num: 0,
      arg_type: 'string',
      arg_val: 'notpal',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 5,
      arg_num: 0,
      arg_type: 'string',
      arg_val: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'is_palindrome',
      test_num: 6,
      arg_num: 0,
      arg_type: 'string',
      arg_val: 'a',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      puzzle_name: 'char_count',
      test_num: 0,
      arg_num: 0,
      arg_type: 'char',
      arg_val: 'i',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 0,
      arg_num: 1,
      arg_type: 'string',
      arg_val: 'this is a string',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 1,
      arg_num: 0,
      arg_type: 'char',
      arg_val: 'a',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 1,
      arg_num: 1,
      arg_type: 'string',
      arg_val: 'second test',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 2,
      arg_num: 0,
      arg_type: 'char',
      arg_val: 'h',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 2,
      arg_num: 1,
      arg_type: 'string',
      arg_val: 'hello world',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 3,
      arg_num: 0,
      arg_type: 'char',
      arg_val: 's',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      puzzle_name: 'char_count',
      test_num: 3,
      arg_num: 1,
      arg_type: 'string',
      arg_val: 'ssssxssss',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    ], {});
  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('inputs', null, {});
  }
};
