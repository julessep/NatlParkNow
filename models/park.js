'use strict';
module.exports = (sequelize, DataTypes) => {
  var Park = sequelize.define('Park', {
    fullName: DataTypes.STRING,
    parkCode: DataTypes.STRING
  }, {timestamps: false});

  Park.associate = function(models) {
  };

  return Park;
};