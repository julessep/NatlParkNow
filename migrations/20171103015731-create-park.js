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
      states: {
        type: Sequelize.STRING
      },
      latLong: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      designation: {
        type: Sequelize.TEXT
      },
      parkCode: {
        type: Sequelize.STRING
      },
      directionsInfo: {
        type: Sequelize.TEXT
      },
      directionsUrl: {
        type: Sequelize.STRING
      },
      fullName: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING        
      },
      weatherInfo: {
        type: Sequelize.TEXT
      },
      name: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Parks');
  }
};