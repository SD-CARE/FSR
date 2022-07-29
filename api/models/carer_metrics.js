const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class carer_metric extends Model {}
  carer_metric.init(
    {
      carerMetricsID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: false, sequelize }
  );

  return carer_metric;
};
