const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Region extends Model {}
  Region.init(
    {
      regionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      CPID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      regionName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { sequelize }
  );
  Region.associate = (models) => {
    Region.belongsToMany(models.Client, {
      through: {
        model: models.client_region,
        unique: false,
      },
      as: "ClientRegion",
      foreignKey: {
        fieldName: "regionID",
        allowNull: false,
        validate: {
          notNull: { msg: "Please provide a Client surname" },
          notEmpty: { msg: "Client surname must not be empty" },
        },
      },
      constraints: false,
    });
    Region.belongsToMany(models.Carer, {
      through: models.carer_region,
      as: "CarerRegion",
      foreignKey: {
        fieldName: "regionID",
        allowNull: false,
      },
    });
  };
  return Region;
};
