'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.TEXT,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {timestamps: false});

  User.associate = function(models) {
    User.hasMany(models.Favorite, {
      foreignKey: "userId"
    });
  };
  
  return User;
};