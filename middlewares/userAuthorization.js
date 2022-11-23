const { User } = require("../models");

function authorization(req, res, next) {
  let UserId = req.params.id || 0;
  const authenticatedUser = res.locals.user;

  User.findOne({
    where: {
      id: UserId,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          name: "Data Not Found",
          message: "access denied",
        });
      }
      if (user.id === authenticatedUser.id) {
        return next();
      } else {
        return res.status(403).json({
          name: "Authorization Error",
          message: "access denied",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
}

module.exports = authorization;
