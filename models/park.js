'use strict';
module.exports = (sequelize, DataTypes) => {
  var Park = sequelize.define('Park', {
    states: DataTypes.STRING,
    latLong: DataTypes.STRING,
    description: DataTypes.TEXT,
    designation: DataTypes.STRING,
    parkCode: DataTypes.STRING,
    directionsInfo: DataTypes.STRING,
    directionsUrl: DataTypes.STRING,
    fullName: DataTypes.STRING,
    url: DataTypes.STRING,
    weatherInfo: DataTypes.TEXT,
    name: DataTypes.STRING
  }, {timestamps: false});

  Park.associate = function(models) {
    Park.belongsToMany(models.User, {
      through: 'UserFavorites',
      onDelete: 'CASCADE'
    });
  };

  Park.associate = function(models) {
    Park.hasMany(models.Handle, {
      foreignKey: "parkId"
    });
  };

  // Park.associate = function(models) {
  //   Park.hasMany(models.Hashtag, {
  //     foreignKey: "parkId"
  //   });
  // };

  return Park;
};