const userService = require("../services/userService.js");

async function createNewUser(data) {
  return await userService.createNewUser(data);
}

async function getUserData(user) {
  return await userService.getUserData(user);
}

module.exports = {
  createNewUser,
  getUserData,
};
