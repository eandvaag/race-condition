'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('games', {
			creator: {
				type: Sequelize.STRING,
				references: {
					model: 'users',
					key: 'username'
				}
			},
			languages: {
				type: Sequelize.STRING,
				allowNull: false
			},
			tot_player_num: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			cur_player_num: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			num_easy: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			num_moderate: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			num_challenging: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			time_easy: {
				type: Sequelize.FLOAT,
				allowNull: false
			},
			time_moderate: {
				type: Sequelize.FLOAT,
				allowNull: false
			},
			time_challenging: {
				type: Sequelize.FLOAT,
				allowNull: false
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('games');
	}
};