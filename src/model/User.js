const { Model, Sequelize, DataTypes } = require("sequelize");
const database = require("./db").database;
const moment = require("moment");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
      len: [11, 11],
      validate: {
        is: /[0-9]{11}/,
      },
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: false,
      len: [3, 60],
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
      validate: {
        is: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
    },
    updated_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    updated_time: {
      type: DataTypes.TIME,
      defaultValue: moment().format("LT"),
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "users",
    timestamps: false,
  }
);

User.sync();

module.exports = {
  User,
};
