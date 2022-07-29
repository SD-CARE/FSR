const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Complied extends Model {}
  Complied.init(
    {
      compliedID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      compliedNotComplied: {
        type: DataTypes.BOOLEAN,
      },
    },
    { sequelize }
  );
  Complied.associate = (models) => {
    Complied.belongsToMany(models.Metric, {
      through: models.metric_complied,
      as: "metricComplied",
      foreignKey: {
        fieldName: "compliedID",
        allowNull: false,
      },
    });
  };
  return Complied;
};
