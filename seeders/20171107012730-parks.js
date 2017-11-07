'use strict';

let { parks } = require('./data/parks');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Parks', parks, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Parks', null, {});
  }
};