const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class metric_complied extends Model {}
  metric_complied.init(
    {
      metricCompliedID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: false, sequelize }
  );

  return metric_complied;
};
