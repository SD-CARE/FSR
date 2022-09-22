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
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    { timestamps: false, sequelize }
  );
  metric_rating.associate = (models) => {
    metric_rating.belongsTo(models.Carer, {
      as: "carerMetricRating",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });
    metric_rating.belongsTo(models.User, {
      as: "userMetricRating",
      foreignKey: {
        fieldName: "userID",
        allowNull: false,
      },
    });
  };

  return metric_rating;
};
