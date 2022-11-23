const { Comment } = require("../models");

function authorization(req, res, next) {
  const CommentId = req.params.id || 0;
  const authenticatedUser = res.locals.user;

  Comment.findOne({
    where: {
      id: CommentId,
    },
  })
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({
          name: "Data Not Found",
          message: "comment not found",
        });
      }
      if (comment.UserId === authenticatedUser.id) {
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
