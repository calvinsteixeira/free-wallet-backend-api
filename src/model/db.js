const { Sequelize } = require("sequelize");
let database = null;

try {
  if (process.env.DB_ENDPOINT) {
    database = new Sequelize(
      process.env.DB_ENDPOINT,
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
      {
        port: process.env.DB_PORT,
      }
    );
  } else {
    database = new Sequelize({
      dialect: "sqlite",
      storage: "./free-wallet-database.sqlite",
    });
  }
} catch (error) {
  console.log("Falha na configuração de conexão com o banco de dados");
}

try {
  database.authenticate();
  console.log("Banco de dados conectado...");
} catch (error) {
  console.log("Falha na conexão com o banco de dados");
}

module.exports = {
  database,
};
