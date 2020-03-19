'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('solved_puzzles', [
    {
      username: 'erik',
      puzzle_name: 'fibonacci',
      language: 'python',
      time: 0.04,
      length: 104,
      solution: 'def fibonacci(n):\n' +
    '  if n == 0 or n == 1:\n' +
    '    return n\n' +
    '  else:\n' +
    '    return fibonacci(n-1) + fibonacci(n-2)',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'arvid',
      puzzle_name: 'fibonacci',
      language: 'python',
      time: 0.01,
      length: 97,
      solution: 'def fibonacci(n):\n' +
    '  l = [0,1]\n' +
    '  for i in range(2,n+1):\n' +
    '    l.append(l[-2] + l[-1])\n' +
    '  return l[n]\n',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'fibonacci',
      language: 'scheme',
      time: 0.81,
      length: 126,
      solution: '(define fibonacci\n' +
    '  (lambda (n)\n' +
    '    (if (or (= n 0) (= n 1))\n' +
    '        n\n' +
    '        (+ (fibonacci (- n 1)) (fibonacci (- n 2))))))\n',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'fibonacci',
      language: 'javascript',
      time: 0.03,
      length: 125,
      solution: 'function fibonacci(n) {\n' +
    '  if (n == 0 || n == 1) {\n' +
    '    return n;\n' +
    '  } else {\n' +
    '    return fibonacci(n-1) + fibonacci(n-2);\n' +
    '  }\n' +
    '}\n',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'fibonacci',
      language: 'haskell',
      time: 0.43,
      length: 94,
      solution: 'fibonacci n\n' + 
 ' | n == 0 || n == 1 = n\n' + 
 ' | otherwise = ((fibonacci (n - 1)) + (fibonacci (n - 2)))',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'sort',
      language: 'python',
      time: 0.02,
      length: 31,
      solution: 'def sort(l):\n  return sorted(l)',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'sort',
      language: 'scheme',
      time: 0.84,
      length: 461,
      solution: '(define (sort e)\n'+
'  (if (or (null? e) (<= (length e) 1)) e\n'+
'      (let loop ((left null) (right null)\n'+
'                   (pivot (car e)) (rest (cdr e)))\n'+
'            (if (null? rest)\n'+
'                (append (append (sort left) (list pivot)) (sort right))\n'+
'               (if (<= (car rest) pivot)\n'+
'                    (loop (append left (list (car rest))) right pivot (cdr rest))\n'+
'                    (loop left (append right (list (car rest))) pivot (cdr rest)))))))',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'sort',
      language: 'haskell',
      time: 0.32,
      length: 148,
      solution: 'sort []     = []\n'+
'sort (p:xs) = (sort lesser) ++ [p] ++ (sort greater)\n'+
'    where\n'+
'        lesser  = filter (< p) xs\n'+
'        greater = filter (>= p) xs',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'collatz',
      language: 'python',
      time: 0.02,
      length: 135,
      solution: 'def collatz(n):\n' +
    '\tl = []\n' +
    '\twhile n != 1:\n' +
    '\t\tl.append(n)\n' +
    '\t\tif (n % 2) == 0:\n' +
    '\t\t\tn = n // 2\n' +
    '\t\telse:\n' +
    '\t\t\tn = (3 * n) + 1\n' +
    '\tl.append(1)\n' +
    '\treturn l',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'char_count',
      language: 'javascript',
      time: 0.03,
      length: 50,
      solution: 'function char_count(c,s) {\n'+
      'return s.split(c).length - 1\n' +
      '}',
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      username: 'erik',
      puzzle_name: 'char_count',
      language: 'python',
      time: 0.02,
      length: 40,
      solution: 'def char_count(c,s):\n'+ '\treturn s.count(c)',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'char_count',
      language: 'haskell',
      time: 0.39,
      length: 86,
      solution: 'char_count x xs = foldl (\\count char -> if char == x then (count + 1) else count) 0 xs',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'erik',
      puzzle_name: 'is_palindrome',
      language: 'haskell',
      time: 0.30,
      length: 32,
      solution: 'is_palindrome w = w == reverse w',
      createdAt: new Date(),
      updatedAt: new Date()
    },   
    {
      username: 'arvid',
      puzzle_name: 'collatz',
      language: 'python',
      time: 0.2,
      length: 300,
      solution: 'sample',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('solved_puzzles', null, {});
  }
};
