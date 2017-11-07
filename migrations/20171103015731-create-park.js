'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Parks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING
      },
      screenName: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      parkCode: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      states: {
        type: Sequelize.STRING
      },
      weatherInfo: {
        type: Sequelize.TEXT
      },
      url: {
        type: Sequelize.STRING        
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Parks');
  }
};