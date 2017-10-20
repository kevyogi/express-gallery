module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('user', {
    username: {type: DataTypes.STRING, unique: true},
    password: DataTypes.STRING
  }, {
    tableName: 'users'
  });

  User.associate = function (models) {
    User.hasMany(models.gallery);
  };
  return User;
};