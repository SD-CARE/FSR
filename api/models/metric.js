const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Metric extends Model {}
  Metric.init(
    {
      metricNameID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      performanceMetric: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Please provide a Performance Metric" },
          notEmpty: { msg: "Please provide a Performance Metric" },
        },
      },
    },
    { sequelize }
  );

  Metric.associate = (models) => {
    // One to many association
    Metric.belongsToMany(models.Complied, {
      through: models.metric_complied,
      as: "MetricComplied",
      foreignKey: {
        fieldName: "metricID",
        allowNull: false,
      },
    });
    // One to many association
    Metric.belongsToMany(models.Rating, {
      through: models.metric_rating,
      as: "MetricRating",
      foreignKey: {
        fieldName: "metricID",
        allowNull: false,
      },
    });
    // Many to many
    Metric.belongsToMany(models.Carer, {
      through: models.carer_metric,
      as: "CarerMetrics",
      foreignKey: {
        fieldName: "metricId",
        allowNull: false,
      },
    });
    Metric.belongsToMany(models.Comment, {
      through: models.metric_comment,
      as: "MetricComments",
      foreignKey: {
        fieldName: "metricId",
        allowNull: false,
      },
    });
  };
  return Metric;
};
