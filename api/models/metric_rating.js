const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class metric_rating extends Model {}
  metric_rating.init(
    {
      metricRatingID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: false, sequelize }
  );

  return metric_rating;
};
