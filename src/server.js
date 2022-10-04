// EXPRESS
const express = require("express");
const { routes } = require("./routes/routes.js");
const router = express.Router();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/", router);
routes(router);

app.listen(process.env.PORT || PORT, () => {
  console.log("Servidor rodando");
});
