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
      through: {
        model: models.metric_complied,
        unique: false,
      },
      as: "MetricComplied",
      foreignKey: {
        fieldName: "metricID",
        allowNull: false,
      },
      constraints: false,
    });
    // One to many association
    Metric.belongsToMany(models.Rating, {
      through: {
        model: models.metric_rating,
        unique: false,
      },
      as: "MetricRating",
      foreignKey: {
        fieldName: "metricID",
        allowNull: false,
      },
      constraints: false,
    });

    Metric.hasMany(models.Comment, {
      as: "matricComment",
      foreignKey: {
        fieldName: "metricID",
        allowNull: false,
      },
    });
  };
  return Metric;
};
