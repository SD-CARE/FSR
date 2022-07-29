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
    },
    { timestamps: false, sequelize }
  );

  return client_call;
};
