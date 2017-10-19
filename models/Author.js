module.exports = function (sequelize, DataTypes) {
  var Author = sequelize.define('author', {
    name: DataTypes.STRING
  }, {
    tableName: 'authors'
  });

  Author.associate = function (models) {
    Author.hasMany(models.gallery);
  };
  return Author;
};