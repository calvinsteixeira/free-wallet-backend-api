function validateFields(fields) {
  let validatedFields = {};
  let fieldErrors = [];

  const fieldValidation = {
    cpf: () => {
      if (!fields.cpf) {
        fieldErrors.push("O campo [cpf] não pode ser vazio");
      } else {
        if (typeof fields.cpf != "string") {
          fields.cpf = fields.toString();
          fields.cpf.replaceAll(/[.-]/, "");
          if (/[0-9]{11}/.test(fields.cpf) === false) {
            fieldErrors.push("Formato inválido para o campo [cpf]");
          }
        }
      }
    },
    name: () => {
      if (!fields.name) {
        fieldErrors.push("O campo [name] não pode ser vazio");
      } else {
        if (
          typeof fields.name != "string" ||
          /[A-z]{3,60}/g.test(fields.name) === false
        ) {
          fieldErrors.push("Formato inválido para o campo [nome]");
        }
      }

      fields.name = fields.name.toLowerCase();
    },
    password: () => {
      if (!fields.password) {
        fieldErrors.push("O campo [password] não pode ser vazio");
      } else {
        if (typeof fields.password != "string") {
          fields.password = fields.password.toString();
          if (/[0-9]{4,8}/.test(fields.password) === false) {
            fieldErrors.push("Formato inválido para o campo [password]");
          }
        }
      }
    },
    email: () => {
      if (!fields.email) {
        fieldErrors.push("O campo [email] não pode ser vazio");
      } else {
        if (
          typeof fields.email != "string" ||
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
            fields.email
          ) === false
        ) {
          fieldErrors.push("Formato inválido para o campo [email]");
        }
      }
    },
    userId: () => {
      if (!fields.decodedJWT.userId) {
        fieldErrors.push("O campo [userId] não está presente na requisição");
      } else if (typeof fields.decodedJWT.userID != "number") {
        fieldErrors.push("Formato inválido para o campo [userId]");
      }
    },
    transactionDescription: () => {
      if (!fields.transactionDescription) {
        fieldErrors.push("O campo [transactionDescription] não pode ser vazio");
      }

      if (typeof fields.transactionDescription != "string") {
        fieldErrors.push(
          "Formato inválido para o campo [transactonDescription]"
        );
      }
    },
    transactionValue: () => {
      if (!fields.transactionValue) {
        fieldErrors.push("O campo [transactionValue] não pode ser vazio");
      }

      if (!/([0-9]+)[.]([0-9]{1,2})\b/.test(fields.transactionValue)) {
        fieldErrors.push(
          "O campo [transactionValue] não é válido, precisa conter 2 casas decimais"
        );
      }
    },
    releasedDate: () => {
      fields.releasedDate = new Date(fields.releasedDate);

      if (!fields.releasedDate) {
        fieldErrors.push("O campo [releasedDate] não pode ser vazio");
      } else if (typeof fields.releasedDate != "object") {
        fieldErrors.push("Formato inválido para o campo [releasedDate]");
      }

      if (fields.releasedDate > Date.now()) {
        fieldErrors.push(
          "A data informada não deve ser maior do que a data de hoje"
        );
      }
    },
  };

  for (let field in fields) {
    if (!fieldValidation[`${field}`]) {
      break;
    }

    fieldValidation[`${field}`]();
  }

  validatedFields = fields;

  return {
    validatedFields,
    fieldErrors,
  };
}

module.exports = {
  validateFields,
};
