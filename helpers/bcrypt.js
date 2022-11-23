const bcrypt = require("bcrypt");

function hashPassword(userPass) {
  const saltRound = 10;
  const salt = bcrypt.genSaltSync(saltRound);
  const hash = bcrypt.hashSync(userPass, salt);
  return hash;
}

function comparePassword(userPass, hashPass) {
  return bcrypt.compareSync(userPass, hashPass);
}

module.exports = {
  hashPassword,
  comparePassword,
};
