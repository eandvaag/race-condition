'use strict';
module.exports = (sequelize, DataTypes) => {

	var puzzles = sequelize.define('puzzles', {
			name: {
				primaryKey: true,
				type: DataTypes.STRING
			},
			description: {
				type: DataTypes.STRING(5000)
			},
			difficulty: {
				type: DataTypes.ENUM('easy', 'moderate', 'challenging')
			},
			arg_count: {
				type: DataTypes.INTEGER
			},
			a0: {
				type: DataTypes.STRING,
				allowNull: true
			},
			a1: {
				type: DataTypes.STRING,
				allowNull: true
			},
			a2: {
				type: DataTypes.STRING,
				allowNull: true
			},
			a3: {
				type: DataTypes.STRING,
				allowNull: true
			},
			a4: {
				type: DataTypes.STRING,
				allowNull: true
			},
			out: {
				type: DataTypes.STRING
			}
	});
	return puzzles;
};