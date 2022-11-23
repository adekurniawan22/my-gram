const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

function authentication(req, res, next) {
  try {
    const token = req.get("token");
    const userDecoded = verifyToken(token);

    User.findOne({
      where: {
        id: userDecoded.id,
        //email: userDecoded.email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            name: "Authentication Error",
            devMessage: `User with id "${userDecoded.id}" not found in database`,
          });
        }
        res.locals.user = user;
        return next();
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } catch (err) {
    if(err.message === 'jwt malformed') {
      return res.status(401).json({message:'token salah'});  
    }
    return res.status(err.code).json({message:err.message});
  }
}

module.exports = authentication;
