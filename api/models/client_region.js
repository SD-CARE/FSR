const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class client_region extends Model {}
  client_region.init(
    {
      clientRegionID: {
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
      sequelize,
    }
  );
  return client_region;
};
