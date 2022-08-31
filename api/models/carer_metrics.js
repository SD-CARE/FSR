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
    { sequelize }
  );
  carer_metric.associate = (models) => {
    // carer_metric.belongsTo(models. {
    //   as: "clientPOC",
    //   foreignKey: {
    //     fieldName: "POC_ID",
    //     allowNull: false,
    //     validate: {
    //       notNull: {
    //         msg: "Please provide a POC_ID",
    //       },
    //       notEmpty: {
    //         msg: "Please provide a POC_ID",
    //       },
    //     },
    //   },
    // });
  };
  return carer_metric;
};
