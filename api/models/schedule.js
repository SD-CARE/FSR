const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Schedule extends Model {}
  Schedule.init(
    {
      scheduleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      schedule: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please provide a valid schedule" },
          notEmpty: { msg: "Schedule cannot be empty" },
        },
      },
    },
    { sequelize }
  );
  Schedule.associate = (models) => {
    Schedule.belongsToMany(models.Client, {
      through: models.client_schedule,
      as: "ClientSchedule",
      foreignKey: {
        fieldName: "scheduleID",
        allowNull: false,
      },
    });
    Schedule.belongsToMany(models.Carer, {
      through: models.carer_schedule,
      as: "CarerSchedule",
      foreignKey: {
        fieldName: "scheduleID",
        allowNull: false,
      },
    });
  };
  return Schedule;
};
