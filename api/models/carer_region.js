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

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { sequelize }
  );

  return carer_region;
};
