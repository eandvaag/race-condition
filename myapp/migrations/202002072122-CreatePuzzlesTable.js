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
			arg_count: {
				type: Sequelize.INTEGER
			},
			a0: {
				type: Sequelize.STRING,
				allowNull: true
			},
			a1: {
				type: Sequelize.STRING,
				allowNull: true
			},
			a2: {
				type: Sequelize.STRING,
				allowNull: true
			},
			a3: {
				type: Sequelize.STRING,
				allowNull: true
			},
			a4: {
				type: Sequelize.STRING,
				allowNull: true
			},
			out: {
				type: Sequelize.STRING
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