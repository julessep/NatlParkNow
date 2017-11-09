'use strict';
module.exports = (sequelize, DataTypes) => {
  var Favorite = sequelize.define('Favorite', {
    parkCode: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    parkId: DataTypes.INTEGER
  }, {timestamps: false});

  Favorite.associate = function(models) {
    Favorite.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return Favorite;
};