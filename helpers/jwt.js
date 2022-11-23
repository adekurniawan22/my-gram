const jwt = require("jsonwebtoken");
const SECRET_KEY = "rahasia";
PRIVATE_KEY = SECRET_KEY

function generateToken(payload) {
    const token = jwt.sign(payload,SECRET_KEY);
    return token
}

function verifyToken(token) {
    const decoded = jwt.verify(token, PRIVATE_KEY)
    return decoded
}

module.exports = {
    generateToken,
    verifyToken
}