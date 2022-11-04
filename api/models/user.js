// Import DataTypes and Modal from sequelize
const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  class User extends Model {}
  User.init(
    {
      userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // firstName-STRING
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "First name is required",
          },
          notEmpty: {
            msg: "Please provide your first name",
          },
        },
      },
      // lastName-STRING
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last name is required",
          },
          notEmpty: {
            msg: "Please provide your last name",
          },
        },
      },
      // emailAddress-STRING
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "This email already exsits",
        },
        validate: {
          notNull: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Please provide a valid email address",
          },
        },
      },
      // password-STRING
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          if (val) {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue("password", hashedPassword);
          }
        },
        validate: {
          notNull: {
            msg: "A password is required",
          },
          notEmpty: {
            msg: "Please provide a password",
          },
        },
      },
    },
    { sequelize }
  );
  User.associate = (models) => {
    User.hasMany(models.metric_rating, {
      as: "userMetric",
      foreignKey: {
        fieldName: "userID",
        allowNull: false,
      },
    });
    User.hasMany(models.metric_complied, {
      as: "userMetricComplied",
      foreignKey: {
        fieldName: "userID",
        allowNull: false,
      },
    });
    User.hasMany(models.Comment, {
      as: "userMetricComment",
      foreignKey: {
        fieldName: "userID",
        allowNull: false,
      },
    });
  };
  return User;
};
