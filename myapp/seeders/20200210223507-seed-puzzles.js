'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('puzzles', [

    /* Easy */

    {
      name: 'fibonacci',
      description: 'Write a function fibonacci() that takes an integer argument n, and returns the n\'th Fibonacci number. The Fibonacci sequence is [ 0, 1, 1, 2, 3, 5, 8, ... ] and 0 is considered the zeroeth Fibonacci number.',
      difficulty: 'easy',
      arg_count: 1,
      a0: 'int',
      out: 'int',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'sort',
      description: 'Write a function sort() that takes an unsorted list of integers, and returns the list in sorted order.',
      difficulty: 'easy',
      arg_count: 1,
      a0: 'list-int',
      out: 'list-int',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'is_palindrome',
      description: 'Write a function is_palindrome() that tests if a string is a palindrome (same backwards and forwards). The function returns true if the string is a palindrome; otherwise it returns false. You may assume all strings are single words.',
      arg_count: 1,
      a0: 'string',
      out: 'bool',
      difficulty: 'easy',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'char_count',
      description: 'Write a function char_count() that takes a character and a string and returns the number of times the character appears in the string.',
      difficulty: 'easy',
      arg_count: 2,
      a0: 'char',
      a1: 'string',
      out: 'int',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'harmonic',
      description: 'Write a function harmonic() that takes an integer n and returns the n\'th harmonic number. The n\'th harmonic number is the sum of the reciprocals of the first n natural numbers, e.g. harmonic(3) == 1 + 1/2 + 1/3.',
      difficulty: 'easy',
      arg_count: 1,
      a0: 'int',
      out: 'int',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'collatz',
      description: 'Write a function collatz() that takes an integer n and returns a list containing the Collatz sequence beginning at n. A collatz sequence is formed in the following way: If the input integer n is even, the next number in the sequence is (n/2). If the input integer n is odd, the next number in the sequence is (3*n)+1. The sequence ends when the input integer is 1.',
      difficulty: 'easy',
      arg_count: 1,
      a0: 'int',
      out: 'list-int',
      createdAt: new Date(),
      updatedAt: new Date()
    }, 

    /* Moderate */
    {
      name: 'select',
      description: 'Write a function select() that takes an unordered list of integers and an integer k, and returns the k\'th smallest element in the list. Assume k = 1 refers to the smallest element in the list.',
      difficulty: 'moderate',
      arg_count: 2,
      a0: 'list-int',
      a1: 'int',
      out: 'int',      
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'anagram',
      description: 'Write a function anagram() that takes two strings as input and returns true if the strings are anagrams of each other, false otherwise (i.e., the first string can be constructed by re-arranging the letters of the first string). You may assume each string is a single word.',
      difficulty: 'moderate',
      arg_count: 2,
      a0: 'string',
      a1: 'string',
      out: 'bool',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'lis',
      description: 'Write a function lis() that takes a list of integers as an argument and returns the length of the longest increasing subsequence within the list.',
      difficulty: 'moderate',
      arg_count: 1,
      a0: 'list-int',
      out: 'int',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    /* Difficult */

    {
      name: 'pi',
      description: 'Write a function pi() that takes an integer i and returns the i\'th digit of pi.',
      difficulty: 'challenging',
      arg_count: 1,
      a0: 'int',
      out: 'int',      
      createdAt: new Date(),
      updatedAt: new Date()
    }


    ], {});
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('puzzles', null, {});
  }
};
