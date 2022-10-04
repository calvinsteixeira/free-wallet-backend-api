const transactionService = require("../services/transactionService");

async function createNewTransaction(data) {
  return await transactionService.createNewTransaction(data);
}

async function updateTransaction(data) {
  return await transactionService.updateTransaction(data);
}

async function deleteTransaction(data) {
  return await transactionService.deleteTransaction(data);
}

module.exports = {
  createNewTransaction,
  updateTransaction,
  deleteTransaction,
};
