const { ValidationError } = require("sequelize");
const { User, Photo, Comment } = require("../models");

class PhotoController {
  // Create
  static createPhoto(req, res) {
    const user = res.locals.user;
    const { title, caption, poster_image_url } = req.body;

    Photo.create({
      title,
      caption,
      poster_image_url,
      UserId: user.id,
    })
      .then((result) => {
        let response = {
          id: result.id,
          title: result.title,
          caption: result.caption,
          poster_image_url: result.poster_image_url,
          UserId: user.id,
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

  // Get All
  static GetAllPhoto(req, res) {
    Photo.findAll({
      include: [
        { model: User, attributes: ["id", "username", "profile_image_url"] },
        {
          model: Comment,
          attributes: ["comment"],
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    })
      .then((result) => {
        if (result == false) {
          return res.status(401).json({
            error: true,
            code: 401,
            message: "Unauthorized",
          });
        }

        return res.status(200).json({ photos: result });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }

  // Update
  static updateFoto(req, res) {
    let { title, caption, poster_image_url } = req.body;

    Photo.update(
      {
        title,
        caption,
        poster_image_url,
      },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      }
    )
      .then((result) => {
        let response = {
          photo: result[1][0],
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

  // Delete
  static deleteFoto(req, res) {
    Photo.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        return res
          .status(200)
          .json({ message: "Your photo has been successfully deleted" });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
}

module.exports = PhotoController;
