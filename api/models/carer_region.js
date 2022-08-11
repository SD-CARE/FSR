const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class carer_region extends Model {}
  carer_region.init(
    {
      clientRegionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: false, sequelize }
  );

  return carer_region;
};
