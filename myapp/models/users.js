'use strict';

var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {

	var users = sequelize.define('users', {
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		num_easy_solved: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		},
		num_moderate_solved: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		},
		num_difficult_solved: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		},
		total_solved: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'			
		},
		games_played: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		},
		games_won: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		},
		games_lost: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		},
		rank: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "Newbie"
		},
		status: {
			type: DataTypes.ENUM("not_playing", "join_waiting", 
					"creating", "create_waiting", "starting", "create_playing", "join_playing"),
			allowNull: false,
			defaultValue: "not_playing"
		},
		socket_id: {
			type: DataTypes.STRING,
			defaultValue: null
		},
		picture: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	});

	users.addHook('beforeCreate', (user) => {
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(user.password, salt);
	});

	users.prototype.check_password = function(password) {
		return bcrypt.compareSync(password, this.password);
	}
	
/*

	}, {
		hooks: {
			beforeCreate: (user) => {
				const salt = bcrypt.genSaltSync();
				user.password = bcrypt.hashSync(user.password, salt);
			}
		}
	}, {
		instanceMethods: {
			validPassword: function(password) {
				return bcrypt.compareSync(password, this.password);
			}
		}
		*/
	//});
	return users;
};