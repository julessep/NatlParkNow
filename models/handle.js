'use strict';
module.exports = (sequelize, DataTypes) => {
  var Handle = sequelize.define('Handle', {
    screenName: DataTypes.STRING,
    parkCode: DataTypes.STRING
  }, {timestamps: false});

  Handle.associate = function(models) {
    Handle.hasOne(models.Park, {
      foreignKey: 'handleId',
      onDelete: 'CASCADE'
    });
  };

  return Handle;
};