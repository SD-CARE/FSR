const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Carer extends Model {}
  Carer.init(
    {
      carerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      CPID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      forename: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please enter a forename" },
          notEmpty: { msg: "Forename can not be empty" },
        },
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please enter a surname" },
          notEmpty: { msg: "Surname can not be empty" },
        },
      },
      initials: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NPC: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please enter an NPC number" },
          notEmpty: { msg: "NPC number can not be empty" },
        },
      },
    },
    { sequelize }
  );
  Carer.associate = (models) => {
    // Many to many associations
    Carer.belongsToMany(models.Client, {
      through: {
        model: models.carer_client,
        unique: false,
      },
      as: "CarerClient",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
      constraints: false,
    });

    Carer.belongsToMany(models.Region, {
      through: models.carer_region,
      as: "CarerRegion",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });

    Carer.hasMany(models.client_call, {
      as: "carerClientCalls",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });

    Carer.hasMany(models.metric_rating, {
      as: "carerMetricRating",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });

    Carer.hasMany(models.metric_complied, {
      as: "carerMetricComplied",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });

    Carer.hasMany(models.client_POC, {
      as: "carerClientPOC",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });
  };
  return Carer;
};
