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

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { timestamps: false, sequelize }
  );
  metric_complied.associate = (models) => {
    metric_complied.belongsTo(models.Carer, {
      as: "carerMetricComplied",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });
  };
  return metric_complied;
};
