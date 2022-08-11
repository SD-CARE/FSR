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
  // carer_client.associate = (models) => {
  //   carer_client.hasMany(models.client_POC, {
  //     as: "carerClient",
  //     foreignKey: {
  //       fieldName: "carerClientID",
  //       allowNull: false,
  //     },
  //   });
  //   carer_client.hasMany(models.client_calls, {
  //     as: "carerClient",
  //     foreignKey: {
  //       fieldName: "carerClientID",
  //       allowNull: false,
  //     },
  //   });
  // };
  return carer_client;
};
