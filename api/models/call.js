const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Call extends Model {}
  Call.init(
    {
      callID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      call: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Call already exists",
        },
        validate: {
          notEmpty: { msg: "Please enter the respective client calls" },
          notNull: { msg: "Calls cannot be empty" },
        },
      },
    },
    { sequelize }
  );
  // One to many association
  Call.associate = (models) => {
    Call.belongsToMany(models.Client, {
      through: models.client_call,
      as: "ClientCall",
      foreignKey: {
        fieldName: "callID",
        allowNull: false,
      },
    });
  };
  return Call;
};
