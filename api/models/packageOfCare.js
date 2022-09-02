const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class PackageOfCare extends Model {}
  PackageOfCare.init(
    {
      POC_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PackageOfCare: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Please provide a POC" },
          notEmpty: { msg: "POC must not be empty" },
        },
      },
    },
    { sequelize }
  );
  // One to many association
  PackageOfCare.associate = (models) => {
    PackageOfCare.belongsToMany(models.Client, {
      through: {
        model: models.client_POC,
        unique: false,
      },
      as: "ClientPOC",
      foreignKey: {
        fieldName: "POC_ID",
        allowNull: false,
      },
      constraints: false,
    });
  };
  return PackageOfCare;
};
