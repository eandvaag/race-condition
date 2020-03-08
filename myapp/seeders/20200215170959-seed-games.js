'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('games', [
    {
      creator: 'ian',
      languages: 'all',
      tot_player_num: 4,
      cur_player_num: 1,
      num_easy: 3,
      num_moderate: 2,
      num_challenging: 0,
      time_easy: 1.0,
      time_moderate: 2.5,
      time_challenging: 5.0,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },
  down: (queryInterface, Sequelize) => {

    return queryInterface.bulkDelete('games', null, {});
  }
};
