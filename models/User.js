module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: DataTypes.STRING
  }, {
    tableName: 'users'
  });

  User.associate = function (models) {
    User.hasMany(models.gallery);
  };
  return User;
};