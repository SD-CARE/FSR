const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class client_call extends Model {}
  client_call.init(
    {
      clientCallsID: {
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
  client_call.associate = (models) => {
    client_call.belongsTo(models.Carer, {
      as: "carerClientCalls",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });
  };
  return client_call;
};
