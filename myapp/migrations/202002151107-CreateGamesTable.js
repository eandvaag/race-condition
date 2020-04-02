'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('games', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            creator: {
                type: Sequelize.STRING,
                references: {
                    model: 'users',
                    key: 'username'
                }
            },
            invitee: {
                type: Sequelize.STRING,
                references: {
                    model: 'users',
                    key: 'username'
                }
            },
            status: {
                type: Sequelize.ENUM('pending', 'in_progress', 'completed')
            },
            languages: {
                type: Sequelize.STRING,
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
            puzzle_names: {
                type: Sequelize.STRING,
                allowNull: false
            },
            time_easy: {
                type: Sequelize.INTEGER
            },
            time_moderate: {
                type: Sequelize.INTEGER
            },
            time_challenging: {
                type: Sequelize.INTEGER
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('games');
    }
};