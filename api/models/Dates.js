const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class DateRange extends Model {}
  DateRange.init(
    {
      dateID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please provide a start date" },
          notEmpty: { msg: "Date range must not be empty" },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please provide a end date" },
          notEmpty: { msg: "Date range must not be empty" },
        },
      },
    },
    { sequelize }
  );
  DateRange.associate = (models) => {
    // One to many association
  };
  return DateRange;
};
