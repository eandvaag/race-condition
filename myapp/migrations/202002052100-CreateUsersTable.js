'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {
			username: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING
			},
			num_solved: {
				allowNull: false,
				defaultValue: '0',
				type: Sequelize.INTEGER
			},
			score: {
				allowNull: false,
				defaultValue: '0',
				type: Sequelize.INTEGER
			}
		}, {
		hooks: {
			beforeCreate: (user) => {
				const salt = bcrypt.genSaltSync();
				user.password = bcrypt.hashSync(user.password, salt);
			}
		},
		instanceMethods: {
			validPassword: function(password) {
				return bcrypt.compareSync(password, this.password);
			}
		}
	});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('users');
	}
};