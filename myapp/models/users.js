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
		num_solved:{
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		},
		score: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: '0'
		}

		
	});

	users.addHook('beforeCreate', (user) => {
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(user.password, salt);
	});

	users.prototype.validPassword = function(password) {
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