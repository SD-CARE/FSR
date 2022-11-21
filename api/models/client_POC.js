const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class client_POC extends Model {}
  client_POC.init(
    {
      clientPOCID: {
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
    {
      timestamps: false,
      sequelize,
    }
  );
  client_POC.associate = (models) => {
    client_POC.belongsTo(models.Carer, {
      as: "carerClientPOC",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });
  };
  return client_POC;
};
