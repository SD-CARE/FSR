const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class carer_client extends Model {}
  carer_client.init(
    {
      carerClientID: {
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

  return carer_client;
};
