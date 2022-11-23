const { SocialMedia } = require("../models");

function authorization(req, res, next) {
  const SocialMediaId = req.params.id || 0;
  const authenticatedUser = res.locals.user;

  SocialMedia.findOne({
    where: {
      id: SocialMediaId,
    },
  })
    .then((socialMedia) => {
      if (!socialMedia) {
        return res.status(404).json({
          name: "Data Not Found",
          message: "Social media not found",
        });
      }
      if (socialMedia.UserId === authenticatedUser.id) {
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

module.exports = authorization