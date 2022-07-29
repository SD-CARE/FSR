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
    },
    { timestamps: false, sequelize }
  );

  return client_POC;
};
