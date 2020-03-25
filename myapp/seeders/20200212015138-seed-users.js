'use strict';

var bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {

    const salt = bcrypt.genSaltSync();
    return queryInterface.bulkInsert('users', [
    {
      username: 'erik',
      password: bcrypt.hashSync('#rcLivel0ck!', salt),
      num_easy_solved: 5,
      num_moderate_solved: 0,
      num_difficult_solved: 0,
      total_solved: 5,
      games_played: 5,
      games_won: 3,
      games_lost: 2,
      rank: "Code Grinder",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'alan',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 6,
      num_moderate_solved: 5,
      num_difficult_solved: 7,
      total_solved: 18,
      games_played: 9,
      games_won: 7,
      games_lost: 2,
      rank: "Hacker", // score = 70
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'donald',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 8,
      num_moderate_solved: 5,
      num_difficult_solved: 3,
      total_solved: 16,
      games_played: 6,
      games_won: 5,
      games_lost: 1,
      rank: "Real Programmer",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'ada',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 4,
      num_moderate_solved: 6,
      num_difficult_solved: 4,
      total_solved: 14,
      games_played: 15,
      games_won: 9,
      games_lost: 6,
      rank: "Hacker",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'john',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 8,
      num_moderate_solved: 3,
      num_difficult_solved: 2,
      total_solved: 13,
      games_played: 11,
      games_won: 9,
      games_lost: 2,
      rank: "Real Programmer",
      createdAt: new Date(),
      updatedAt: new Date()
    },   
    {
      username: 'edsger',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 11,
      num_moderate_solved: 5,
      num_difficult_solved: 7,
      total_solved: 23,
      games_played: 17,
      games_won: 9,
      games_lost: 8,
      rank: "Language Lawyer",
      createdAt: new Date(),
      updatedAt: new Date()
    },  
    {
      username: 'richard',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 27,
      num_moderate_solved: 12,
      num_difficult_solved: 15,
      total_solved: 54,
      games_played: 33,
      games_won: 21,
      games_lost: 12,
      rank: "Guru",     // score = 180
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      username: 'dennis',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 27,
      num_moderate_solved: 12,
      num_difficult_solved: 23,
      total_solved: 62,
      games_played: 38,
      games_won: 30,
      games_lost: 8,
      rank: "Wizard",   // score = 238
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      username: 'grace',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 12,
      num_moderate_solved: 12,
      num_difficult_solved: 17,
      total_solved: 41,
      games_played: 42,
      games_won: 31,
      games_lost: 11,
      rank: "Guru",   // score = 195
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      username: 'tony',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 12,
      num_moderate_solved: 12,
      num_difficult_solved: 9,
      total_solved: 33,
      games_played: 33,
      games_won: 20,
      games_lost: 13,
      rank: "Super Programmer",   // score = 133
      createdAt: new Date(),
      updatedAt: new Date()
    }, 
    {
      username: 'charles',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 12,
      num_moderate_solved: 12,
      num_difficult_solved: 25,
      total_solved: 49,
      games_played: 70,
      games_won: 68,
      games_lost: 2,
      rank: "Demi-god",   // score = 309
      createdAt: new Date(),
      updatedAt: new Date()
    }, 


    ], { /*
      validate: true,
      individualHooks: true, */
    });
  },
  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('users', null, {});
  }
};
