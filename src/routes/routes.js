function routes(router) {
  // IMPORTS
  const verifyToken = require("../middlewares/verifyToken");

  // CORS
  const cors = require("cors");
  router.use(cors());

  // CONTROLLERS
  const userController = require("../controller/userController");
  const authController = require("../controller/authController");
  const transactionController = require("../controller/transactionController");

  router.put("/login", async (req, res) => {
    try {
      const credentials = req.body;
      const response = await authController.login(credentials);
      res.status(response.statusCode).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        statusCode: 500,
        hasError: true,
        error: {
          message:
            "Falha interna durante a autenticação, tente novamente dentro de alguns minutos",
        },
      });
    }
  });

  router.put("/novo-usuario", async (req, res) => {
    try {
      const userData = req.body;
      const response = await userController.createNewUser(userData);
      res.status(response.statusCode).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        statusCode: 500,
        hasError: true,
        error: {
          message:
            "Falha interna durante o cadastro, tente novamente dentro de alguns minutos",
        },
      });
    }
  });

  router.put("/nova-transacao", verifyToken, async (req, res) => {
    try {
      let transactionData = req.body;
      transactionData.payloadJWT = req.payloadJWT;
      const response = await transactionController.createNewTransaction(
        transactionData
      );
      res.status(response.statusCode).send(response);
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
  });

  router.get("/buscar-dados-usuario", verifyToken, async (req, res) => {
    try {
      const user = req.payloadJWT;
      const response = await userController.getUserData(user);

      res.status(response.statusCode).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        statusCode: 500,
        hasError: true,
        error: {
          message:
            "Falha interna durante a autenticação, tente novamente dentro de alguns minutos",
        },
      });
    }
  });

  router.put("/alterar-transacao", verifyToken, async (req, res) => {
    try {
      let data = req.body;
      data.payloadJWT = req.payloadJWT;
      const response = await transactionController.updateTransaction(data);

      res.status(response.statusCode).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        statusCode: 500,
        hasError: true,
        error: {
          message:
            "Falha interna durante a autenticação, tente novamente dentro de alguns minutos",
        },
      });
    }
  });

  router.delete(
    "/deletar-transacao/:transactionId",
    verifyToken,
    async (req, res) => {
      try {
        let data = req.params;
        data.payloadJWT = req.payloadJWT;

        const response = await transactionController.deleteTransaction(data);

        res.status(response.statusCode).send(response);
      } catch (err) {
        console.log(err);
        res.status(500).send({
          statusCode: 500,
          hasError: true,
          error: {
            message:
              "Falha interna durante a autenticação, tente novamente dentro de alguns minutos",
          },
        });
      }
    }
  );
}

module.exports = {
  routes,
};
