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
    },
    { sequelize }
  );
  return client_region;
};
