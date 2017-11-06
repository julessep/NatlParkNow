'use strict';
module.exports = (sequelize, DataTypes) => {
  var Park = sequelize.define('Park', {
    fullName: DataTypes.STRING,
    name: DataTypes.STRING,
    parkCode: DataTypes.STRING,
    description: DataTypes.TEXT,
    states: DataTypes.STRING,
    weatherInfo: DataTypes.TEXT,
    url: DataTypes.STRING,
    screenName: DataTypes.STRING
  }, {timestamps: false});

  Park.associate = function(models) {
    Park.belongsToMany(models.User, {
      through: 'UserFavorites',
      onDelete: 'CASCADE'
    });
  };

  Park.associate = function(models) {
    Park.belongsTo(models.Handle, {
      foreignKey: "handleId"
    });
  };

  return Park;
};