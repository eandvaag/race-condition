'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('puzzles', {

			name: {
				primaryKey: true,
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.STRING(5000)
			},
			difficulty: {
				type: Sequelize.ENUM('easy', 'moderate', 'challenging')
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('puzzles');
	}
};