'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Handles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      screenName: {
        type: Sequelize.STRING
      },
      parkCode: {
        type: Sequelize.STRING
      }
    })
  } ,

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Handles');
  }
};