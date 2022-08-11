const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class metric_comment extends Model {}
  metric_comment.init(
    {
      metricCommentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: false, sequelize }
  );

  return metric_comment;
};
