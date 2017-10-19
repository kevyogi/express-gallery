module.exports = function (sequelize, DataTypes) {
  var Gallery = sequelize.define('gallery', {
    link: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    author: {type: DataTypes.STRING, allowNull: false}
  });

/*  Gallery.associate = function (models) {
    Gallery.belongsTo(models.author);
  };*/
  return Gallery;
};

