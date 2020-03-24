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
      username: 'arvid',
      password: bcrypt.hashSync('#D1jk$tra23', salt),
      num_easy_solved: 2,
      num_moderate_solved: 0,
      num_difficult_solved: 0,
      total_solved: 2,
      games_played: 1,
      games_won: 1,
      games_lost: 0,
      rank: "Wannabe",
      createdAt: new Date(),
      updatedAt: new Date()
    }], { /*
      validate: true,
      individualHooks: true, */
    });
  },
  down: (queryInterface, Sequelize) => {

      return queryInterface.bulkDelete('users', null, {});
  }
};
