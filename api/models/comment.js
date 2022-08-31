const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Comment extends Model {}
  Comment.init(
    {
      commentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Please write a comment" },
          notEmpty: { msg: "Comment secrtion cannot be empty" },
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { timestamps: false, sequelize }
  );
  Comment.associate = (models) => {
    // One to many association
    Comment.belongsTo(models.Metric, {
      as: "metricComment",
      foreignKey: {
        fieldName: "metricID",
        allowNull: false,
      },
    });
    Comment.belongsTo(models.Carer, {
      as: "carerMetricComment",
      foreignKey: {
        fieldName: "carerID",
        allowNull: false,
      },
    });
  };
  return Comment;
};
