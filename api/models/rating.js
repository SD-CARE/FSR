const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Rating extends Model {}
  Rating.init(
    {
      ratingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Please provide a valid rating." },
          notEmpty: { msg: "Rating must not be empty." },
        },
      },
    },
    { sequelize }
  );
  Rating.associate = (models) => {
    Rating.belongsToMany(models.Metric, {
      through: models.metric_rating,
      as: "metricRating",
      foreignKey: {
        fieldName: "ratingID",
        allowNull: false,
      },
    });
  };
  return Rating;
};
