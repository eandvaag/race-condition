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
			num_easy_solved: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: '0'
			},
			num_moderate_solved: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: '0'
			},
			num_difficult_solved: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: '0'
			},
			games_played: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: '0'
			},
			games_won: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: '0'
			},
			games_lost: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: '0'
			},
			rank: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "Newbie"
			},
			status: {
				type: Sequelize.ENUM("not_playing", "playing", "join_waiting", 
					"creating", "create_waiting", "starting"),
				allowNull: false,
				defaultValue: "not_playing"
			},
			socket_id: {
				type: Sequelize.STRING,
				defaultValue: null
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