const { User } = require("../model/user");
const { validateFields } = require("../utils/validateFields");
const { comparePassword } = require("../utils/bcrypt");
const jwt = require("../utils/jwt");
let response = null;

async function login(credentials) {
  const validateFieldsResult = validateFields(credentials);

  if (validateFieldsResult.fieldErrors.length > 0) {
    return (response = {
      statusCode: 400,
      hasError: true,
      errors: validateFieldsResult.fieldErrors,
    });
  } else {
    credentials = validateFieldsResult.validatedFields;

    try {
      const dbUser = await User.findOne({
        where: {
          cpf: credentials.cpf,
        },
      });

      if (!dbUser) {
        return {
          statusCode: 401,
          hasError: true,
          error: ["Dados de CPF ou senha inválidos"],
        };
      }

      const match = await comparePassword(
        credentials.password,
        dbUser.dataValues.password
      );

      if (match) {
        const token = jwt.generateToken(
          { userId: dbUser.id, userCpf: dbUser.cpf, name: dbUser.name },
          process.env.JWT_KEY
        );

        return {
          statusCode: 200,
          hasError: false,
          content: {
            message: "Autenticação realizada com sucesso",
            token: token,
          },
        };
      } else {
        return {
          statusCode: 401,
          hasError: true,
          error: ["Dados de CPF ou senha inválidos"],
        };
      }
    } catch (err) {
      console.log(err);
      return (response = {
        statusCode: 500,
        hasError: true,
        error: {
          message:
            "Falha durante a autenticação, tente novamente em alguns minutos",
        },
      });
    }
  }
}

module.exports = {
  login,
};
