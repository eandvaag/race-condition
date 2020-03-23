'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('puzzles', [

    /* Easy */

    {
      name: 'fibonacci',
      description: 'Write a function <code>fibonacci()</code> that takes an integer argument n, and returns the n\'th Fibonacci number. The Fibonacci sequence is [ 0, 1, 1, 2, 3, 5, 8, ... ] and 0 is considered the zeroeth Fibonacci number.',
      difficulty: 'easy',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'sort',
      description: 'Write a function <code>sort()</code> that takes an unsorted list of integers, and returns the list in sorted order.',
      difficulty: 'easy',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'is_palindrome',
      description: 'Write a function <code>is_palindrome()</code> that tests if a string is a palindrome (same backwards and forwards). The function returns true if the string is a palindrome; otherwise it returns false. You may assume all strings are single words.',
      difficulty: 'easy',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'char_count',
      description: 'Write a function <code>char_count()</code> that takes a character and a string and returns the number of times the character appears in the string.',
      difficulty: 'easy',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'collatz',
      description: 'Write a function <code>collatz()</code> that takes an integer n and returns a list containing the Collatz sequence beginning at n. A Collatz sequence is formed in the following way: if the input integer n is even, the next number in the sequence is (n/2). If the input integer n is odd, the next number in the sequence is (3*n)+1. The sequence ends when the input integer is 1.',
      difficulty: 'easy',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'pyth',
      description: 'Write a function <code>pyth()</code> that takes three integers and returns true if the three numbers are a Pythagorean triple, false otherwise. A Pythagorean triple consists of three positive integers <i>a</i>, <i>b</i>, and <i>c</i>, such that <i>a<sup>2</sup></i> + <i>b<sup>2</sup></i> = <i>c<sup>2</sup></i>.',
      difficulty: 'easy',
      createdAt: new Date(),
      updatedAt: new Date()
    },

    /* Moderate */

    {
      name: 'select',
      description: 'Write a function <code>select()</code> that takes an unordered list of integers and an integer k, and returns the k\'th smallest element in the list. Assume k = 1 refers to the smallest element in the list.',
      difficulty: 'moderate',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'anagram',
      description: 'Write a function <code>anagram()</code> that takes two strings as input and returns true if the strings are anagrams of each other, false otherwise (i.e., the first string can be constructed by re-arranging the letters of the first string). You may assume each string is a single word.',
      difficulty: 'moderate',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'lis',
      description: 'Write a function <code>lis()</code> that takes a list of integers as an argument and returns the length of the longest increasing subsequence within the list.',
      difficulty: 'moderate',
      createdAt: new Date(),
      updatedAt: new Date()
    },


    /* Difficult */
    {
      name: 'perfect',
      description: 'Write a function <code>perfect()</code> that takes an integer n and returns the n\'th perfect number. A perfect number is a positive integer that is equal to the sum of its positive divisors, excluding the number itself. For example, 6 has divisors 1, 2, and 3 (excluding itself), and 1 + 2 + 3 = 6, so 6 is the first perfect number.',
      difficulty: 'challenging',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'gcd',
      description: 'Write a function <code>gcd()</code> that takes two integers as arguments and returns the greatest common divisor of the two integers. The greatest common divisor is the largest positive integer that divides both integers.',
      difficulty: 'challenging',
      createdAt: new Date(),
      updatedAt: new Date()
    },  {
      name: 'largest_mode',
      description: 'Write a function <code>largest_mode()</code> that takes three lists of integers as input, calculates the mode of each list, and returns the largest mode.',
      difficulty: 'challenging',
      createdAt: new Date(),
      updatedAt: new Date()
    }


    ], {});
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('puzzles', null, {});
  }
};
