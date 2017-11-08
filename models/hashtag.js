'use strict';
module.exports = (sequelize, DataTypes) => {
  var Hashtag = sequelize.define('Hashtag', {
    hashtag: DataTypes.STRING,
    parkId: DataTypes.INTEGER
  }, {timestamps: false});
  
    // Hashtag.associate = function(models) {
    //   Hashtag.belongsTo(models.Park, {
    //     foreignKey: "parkId",
    //     onDelete: 'CASCADE'
    //   });
    // };
  return Hashtag;
};