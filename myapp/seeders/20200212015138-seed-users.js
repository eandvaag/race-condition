'use strict';

var bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {

    const salt = bcrypt.genSaltSync();
    return queryInterface.bulkInsert('users', [
    {
      username: 'erik',
      password: bcrypt.hashSync('pass', salt),
      num_solved: 5,
      score: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'ian',
      password: bcrypt.hashSync('pass', salt),
      num_solved: 1,
      score: 20,
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
