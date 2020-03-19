module.exports = (sequelize, DataTypes) => {

	var games = sequelize.define('games', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		creator: {
			type: DataTypes.STRING,
			references: {
				model: 'users',
				key: 'username'
			}
		},
		invitee: {
			type: DataTypes.STRING,
			references: {
				model: 'users',
				key: 'username'
			}
		},
		status: {
			type: DataTypes.ENUM('pending', 'in_progress', 'completed')
		},
		languages: {
			type: DataTypes.STRING,
			allowNull: false		
		},
		num_easy: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		num_moderate: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		num_challenging: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		time_easy: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		time_moderate: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		time_challenging: {
			type: DataTypes.FLOAT,
			allowNull: false
		}
	});

	return games;
};