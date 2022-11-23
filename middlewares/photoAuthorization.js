const { Photo } = require("../models");

function authorization(req, res, next) {
  const PhotoId = req.params.id || 0;
  const authenticatedUser = res.locals.user;

  Photo.findOne({
    where: {
      id: PhotoId,
    },
  })
    .then((photo) => {
      if (!photo) {
        return res.status(404).json({
          name: "Data Not Found",
          message: "Photo not found",
        });
      }
      if (photo.UserId === authenticatedUser.id) {
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
