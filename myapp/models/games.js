module.exports = (sequelize, DataTypes) => {

	var games = sequelize.define('games', {
		creator: {
			type: DataTypes.STRING,
			references: {
				model: 'users',
				key: 'username'
			}
		},
		languages: {
			type: DataTypes.STRING,
			allowNull: false		
		},
		tot_player_num: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		cur_player_num: {
			type: DataTypes.INTEGER,
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