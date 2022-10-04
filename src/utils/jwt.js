const jwt = require("jsonwebtoken");

function generateToken(payload) {
  let token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: 60 * 60,
  });

  return token;
}

module.exports = {
  generateToken,
};
