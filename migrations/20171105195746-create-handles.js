'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Handles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      screenName: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      parkCode: {
        type: Sequelize.STRING
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Handles');
  }
};