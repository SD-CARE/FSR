const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class carer_schedule extends Model {}
  carer_schedule.init(
    {
      clientScheduleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: false, sequelize }
  );

  return carer_schedule;
};
