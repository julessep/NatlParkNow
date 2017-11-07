'use strict';

let { screen_names } = require('./data/screen_names');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Handles', screen_names, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Handles', null, {});
  }
};
