const { User } = require("../model/User");
const {
  UserTransaction,
  TransactionCategory,
} = require("../model/Transaction");
const { Sequelize, Op } = require("sequelize");
const { encryptPassword } = require("../utils/bcrypt");
const { validateFields } = require("../utils/validateFields");

let response = null;

async function createNewUser(data) {
  const validateFieldsResult = validateFields(data);

  if (validateFieldsResult.fieldErrors.length > 0) {
    return {
      statusCode: 400,
      hasError: true,
      errors: validateFieldsResult.fieldErrors,
    };
  } else {
    data = validateFieldsResult.validatedFields;

    const userExists = await User.findOne({ where: { cpf: data.cpf } });

    if (userExists) {
      return {
        statusCode: 409,
        hasError: true,
        error: ["CPF já cadastrado no sistema"],
      };
    } else {
      try {
        const bcryptResult = await encryptPassword(data.password);

        if (bcryptResult.hasError === true) {
          throw new Error(bcryptResult.err);
        }

        await User.create({
          cpf: data.cpf,
          name: data.name,
          email: data.email,
          password: bcryptResult.hash,
        });

        return {
          statusCode: 201,
          hasError: false,
          message: "Usuário cadastrado com sucesso",
        };
      } catch (err) {
        console.log(err);
        return {
          statusCode: 500,
          hasError: true,
          error: [err],
        };
      }
    }
  }
}

async function getUserData(user) {
  try {
    const lastTransactions = await UserTransaction.findAll({
      attributes: ["id", "categoryId", "description", "value", "released_date"],
      include: [
        {
          model: TransactionCategory,
          attributes: [["description", "categoryDescription"]],
        },
      ],
      where: {
        userId: user.userId,
      },
    });

    const cashIn = await UserTransaction.findOne({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("value")), "userBalance"],
      ],
      where: {
        [Op.and]: [{ userId: user.userId }, { categoryId: 1 }],
      },
    });

    const cashOut = await UserTransaction.findOne({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("value")), "userBalance"],
      ],
      where: {
        [Op.and]: [{ userId: user.userId }, { categoryId: 2 }],
      },
    });

    let userBalance =
      cashIn.dataValues.userBalance - cashOut.dataValues.userBalance;

    if (typeof userBalance == "number") {
      return {
        statusCode: 200,
        hasError: false,
        content: {
          userBalance: userBalance.toFixed(2), // KEEP DECIMAL DIGIT EVEN IT'S 0... LIKE "0.00" (STRING EXPECTED)
          lastTransactions: lastTransactions,
          username: user.name,
        },
      };
    } else {
      throw Error;
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      hasError: true,
      error: {
        message:
          "Falha interna ao buscar os dados, tente novamente em alguns minutos",
      },
    };
  }
}

module.exports = {
  createNewUser,
  getUserData,
};
