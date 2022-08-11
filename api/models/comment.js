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
    },
    { sequelize }
  );
  Comment.associate = (models) => {
    // One to many association
    Comment.belongsToMany(models.Metric, {
      through: models.metric_comment,
      as: "MetricComments",
      foreignKey: {
        fieldName: "commentID",
        allowNull: false,
      },
    });
  };
  return Comment;
};
