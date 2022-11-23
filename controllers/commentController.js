const { User, Photo, Comment } = require("../models");
const {ValidationError} = require('sequelize')

class CommentController {
  //Create
  static createComment(req, res) {
    let user = res.locals.user;
    let { comment, PhotoId } = req.body;

    Comment.create({
      comment,
      PhotoId,
      UserId: user.id,
    })
      .then((result) => {
        let response = {
          comment: {
            id: result.id,
            comment: result.id,
            UserId: user.id,
            PhotoId: result.PhotoId
          }
        };
        return res.status(201).json(response);
      })
      .catch((err) => {
        if (err instanceof ValidationError == false) {
          res.status(500).json({
            error: true,
            message: err,
          });
        } else {
          const message = [];
          err.errors.forEach((error) => {
            message.push({
              key: error.path,
              msg: error.message,
            });
          });
          res.status(400).json({
            message: message,
          });
        }
      });
  }

  //Get All
  static getAllComment(req, res) {
    Comment.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "profile_image_url", "phone_number"],
        },
        {
          model: Photo,
          attributes: ["id", "title", "caption", "poster_image_url"],
        },
      ],
    })
      .then((result) => {
        return res.status(200).json({
          comment: result,
        });
      })
      .catch((err) => {
        return res.status(500).json({ error: true, message: err });
      });
  }

  //Update
  static updateComment(req, res) {
    let { comment } = req.body;

    Comment.update(
      { comment },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      }
    )
      .then((result) => {
        let response = {
          comment: result[1][0],
        };
        return res.status(200).json(response);
      })
      .catch((err) => {
        if (err instanceof ValidationError == false) {
          res.status(500).json({
            error: true,
            message: err,
          });
        } else {
          const message = [];
          err.errors.forEach((error) => {
            message.push({
              key: error.path,
              msg: error.message,
            });
          });
          res.status(400).json({
            message: message,
          });
        }
      });
  }

  //Delete
  static deleteComment(req, res) {
    Comment.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        return res
          .status(200)
          .json({ message: "Your comment has been successfully deleted" });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
}

module.exports = CommentController;
