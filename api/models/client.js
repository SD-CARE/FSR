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
      forname: {
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
    },
    { sequelize }
  );
  Client.associate = (models) => {
    // One to many association
    Client.belongsToMany(models.Schedule, {
      through: models.client_schedule,
      as: "ClientSchedule",
      foreignKey: {
        fieldName: "scheduleID",
        allowNull: false,
      },
    });
    // One to many association
    Client.belongsToMany(models.Call, {
      through: models.client_call,
      as: "ClientCall",
      foreignKey: {
        fieldName: "clientID",
        allowNull: false,
      },
    });
    // One to many association
    Client.belongsToMany(models.PackageOfCare, {
      through: models.client_POC,
      as: "ClientPOC",
      foreignKey: {
        fieldName: "clientID",
        allowNull: false,
      },
    });
    // Many to many
    Client.belongsToMany(models.Carer, {
      through: models.carer_client,
      as: "CarerClients",
      foreignKey: {
        fieldName: "clientID",
        allowNull: false,
      },
    });
  };
  return Client;
};
