const bcrypt = require("bcrypt");

async function encryptPassword(password) {
  const saultRounds = 8;
  return await bcrypt
    .hash(password, saultRounds)
    .then((hash) => {
      return {
        hasError: false,
        hash: hash,
      };
    })
    .catch((err) => {
      return {
        hasError: true,
        err: err,
      };
    });
}

async function comparePassword(clientPassword, dbPassword) {
  return await bcrypt
    .compare(clientPassword, dbPassword)
    .then((result) => result)
    .catch((err) => err);
}

module.exports = {
  encryptPassword,
  comparePassword,
};
