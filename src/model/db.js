const { Sequelize } = require("sequelize");
let database = null;

try {
  if (process.env.CLEARDB_DATABASE_URL) {
    database = new Sequelize(process.env.CLEARDB_DATABASE_URL);
  } else {
    // PARA CONEXÃO LOCAL COM MYSQL
    // database = new Sequelize(
    //   process.env.DB_NAME,
    //   process.env.DB_USERNAME,
    //   process.env.DB_PASSWORD,
    //   {
    //     host: process.env.DB_HOST,
    //     dialect: process.env.DB_DIALECT,
    //     port: process.env.PORT,
    //   }
    // PARA CONEXÃO LOCAL COM SQLITE
    database = new Sequelize({
      dialect: "sqlite",
      storage: "./database_name.sqlite",
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
