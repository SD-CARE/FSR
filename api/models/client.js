const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Client extends Model {}
  Client.init(
    {
      clientID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      forename: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please provide a Client Forename" },
          notEmpty: { msg: "Client Forename must not be empty" },
        },
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please provide a Client surname" },
          notEmpty: { msg: "Client surname must not be empty" },
        },
      },
      CPID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { sequelize }
  );
  Client.associate = (models) => {
    // One to many association
    Client.belongsToMany(models.Region, {
      through: {
        model: models.client_region,
        unique: false,
      },
      as: "ClientRegion",
      foreignKey: {
        fieldName: "clientID",
        allowNull: false,
        validate: {
          notNull: { msg: "Please provide a Client surname" },
          notEmpty: { msg: "Client surname must not be empty" },
        },
      },
      constraints: false,
    });
    // One to many association
    Client.belongsToMany(models.Call, {
      through: {
        model: models.client_call,
        unique: false,
      },
      as: "ClientCall",
      foreignKey: {
        fieldName: "clientID",
        allowNull: false,
        validate: {
          notNull: { msg: "Please provide a Client surname" },
          notEmpty: { msg: "Client surname must not be empty" },
        },
      },
      constraints: false,
    });

    // One to many association
    Client.belongsToMany(models.PackageOfCare, {
      through: {
        model: models.client_poc,
        unique: false,
      },
      as: "ClientPOC",
      foreignKey: {
        fieldName: "clientID",
        allowNull: false,
      },
      constraints: false,
    });

    // Many to many
    Client.belongsToMany(models.Carer, {
      through: {
        model: models.carer_client,
        unique: false,
      },
      as: "CarerClients",
      foreignKey: {
        fieldName: "clientID",
        allowNull: false,
      },
      constraints: false,
    });
  };
  return Client;
};
