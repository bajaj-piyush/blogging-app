const jwt = require("jsonwebtoken");

const secret = `${process.env.secret}`;

function createTokenForUser(user) {
  const payload = {
    name: user.name,
    _id: user._id,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken,
};
