const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    req.payloadJWT = jwt.verify(req.headers.token, process.env.JWT_KEY);
    next();
  } catch (err) {
    const response = {
      statusCode: 401,
      hasError: true,
      error: {
        message: "Token inválido",
      },
    };

    res.status(response.statusCode).send(response);
  }
};
