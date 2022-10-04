const { Sequelize, DataTypes, Model } = require("sequelize");
const { User } = require("./User");
const database = require("./db").database;

class TransactionCategory extends Model {}
class UserTransaction extends Model {}

// COLUMNS CONFIGURATION
TransactionCategory.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    updated_time: {
      type: DataTypes.TIME,
      defaultValue: DataTypes.TIME,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
  },
  {
    sequelize: database,
    modelName: "transaction_categories",
    timestamps: false,
  }
);

UserTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      unique: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    categoryId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      unique: false,
      foreignKey: true,
      references: {
        model: TransactionCategory,
        key: "id",
      },
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: false,
      len: [0, 100],
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
    released_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isBefore: DataTypes.NOW,
      },
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
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "user_transactions",
    timestamps: false,
  }
);

UserTransaction.hasOne(TransactionCategory, {
  sourceKey: "categoryId",
  foreignKey: "id",
  constraints: false,
});

TransactionCategory.belongsTo(UserTransaction, {
  foreignKey: "categoryId",
  constraints: false,
});

// CREATE IF NOT EXISTS
TransactionCategory.sync();
UserTransaction.sync();

module.exports = {
  TransactionCategory,
  UserTransaction,
};
