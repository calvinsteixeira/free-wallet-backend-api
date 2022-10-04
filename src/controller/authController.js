const authService = require("../services/authService");

async function login(credentials) {
  return await authService.login(credentials);
}

module.exports = {
  login,
};
