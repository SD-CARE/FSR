const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class client_schedule extends Model {}
  client_schedule.init(
    {
      clientScheduleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: false, sequelize }
  );

  return client_schedule;
};
