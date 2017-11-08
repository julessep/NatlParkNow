'use strict';

let { hashtags } = require('./data/hashtags');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Hashtags', hashtags, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Hashtags', null, {});
  }
};
