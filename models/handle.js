'use strict';
module.exports = (sequelize, DataTypes) => {
  var Handle = sequelize.define('Handle', {
    parkId: DataTypes.INTEGER,
    screenName: DataTypes.STRING,
    parkCode: DataTypes.STRING
  }, {timestamps: false});

  Handle.associate = function(models) {
    Handle.belongsTo(models.Park, {
      foreignKey: 'parkId',
      onDelete: 'CASCADE'
    });
  };

  return Handle;
};