const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class client_poc extends Model {}
  client_poc.init(
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
    { timestamps: false, sequelize }
  );
  client_poc.associate = (models) => {
    client_poc.belongsTo(models.Carer, {
      as: "carerClientPOC",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });
  };
  return client_poc;
};
