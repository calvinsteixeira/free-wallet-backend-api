const { UserTransaction } = require("../model/Transaction");
const { Op } = require("sequelize");
const { validateFields } = require("../utils/validateFields");

async function createNewTransaction(data) {
  const validateFieldsResult = validateFields(data);

  if (validateFieldsResult.fieldErrors.length > 0) {
    return {
      statusCode: 400,
      hasError: true,
      error: validateFieldsResult.fieldErrors,
    };
  } else {
    data = validateFieldsResult.validatedFields;

    try {
      await UserTransaction.create({
        userId: data.payloadJWT.userId,
        categoryId: data.content.categoryId,
        description: data.content.transactionDescription,
        value: data.content.transactionValue,
        released_date: data.content.releasedDate,
      });

      return {
        statusCode: 201,
        hasError: false,
        data: {
          message: "Transação criada com sucesso",
        },
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        hasError: true,
        error: {
          message:
            "Falha ao criar o novo registro, tente novamente em alguns minutos",
        },
      };
    }
  }
}

async function updateTransaction(data) {
  const validateFieldsResult = validateFields(data);

  if (validateFieldsResult.fieldErrors.length > 0) {
    return {
      statusCode: 400,
      hasError: true,
      error: validateFieldsResult.fieldErrors,
    };
  } else {
    data = validateFieldsResult.validatedFields;

    console.log(data);

    try {
      await UserTransaction.update(
        {
          userId: data.payloadJWT.userId,
          description: data.content.transactionDescription,
          value: data.content.transactionValue,
          released_date: data.content.releasedDate,
        },
        {
          where: {
            id: data.content.transactionId,
          },
        }
      );

      return {
        statusCode: 204,
        hasError: false,
        data: {
          message: "Transação alterada com sucesso",
        },
      };
    } catch (err) {
      console.log(err);
      return {
        statusCode: 500,
        hasError: true,
        error: {
          message:
            "Falha ao atualizar o registro, tente novamente em alguns minutos",
        },
      };
    }
  }
}

async function deleteTransaction(data) {
  try {
    await UserTransaction.destroy({
      where: {
        [Op.and]: [
          { userId: data.payloadJWT.userId },
          { id: data.transactionId },
        ],
      },
    });

    return {
      statusCode: 204,
      hasError: false,
      data: {
        message: "Transação deleteda com sucesso!",
      },
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      hasError: true,
      error: {
        message:
          "Falha interna ao criar nova transação, tente novamente em alguns minutos",
      },
    };
  }
}

module.exports = {
  createNewTransaction,
  updateTransaction,
  deleteTransaction,
};
