const { User, SocialMedia } = require("../models");
const { ValidationError } = require("sequelize");

class SocialMediaController {
  // Create
  static createSocialMedia(req, res) {
    const user = res.locals.user;
    const { name, social_media_url } = req.body;

    SocialMedia.create({
      name,
      UserId: user.id,
      social_media_url,
    })
      .then((result) => {
        let response = {
          social_media: {
            id: result.id,
            name: result.name,
            UserId: user.id,
            social_media_url: result.social_media_url,
          },
        };
        return res.status(201).json(response);
      })
      .catch((err) => {
        if (err instanceof ValidationError == false) {
          return res.status(500).json({ error: true, message: err });
        } else {
          const message = [];
          err.errors.forEach((error) => {
            message.push({
              key: error.path,
              msg: error.message,
            });
          });
          return res.status(400).json({ message: message });
        }
      });
  }

  // Get All
  static getAllSocialMedia(req, res) {
    let user = res.locals.user;

    SocialMedia.findAll({
      where: {
        UserId: user.id,
      },
      include: [
        { model: User, attributes: ["id", "username", "profile_image_url"] },
      ],
    })
      .then((result) => {
        return res.status(200).json({ social_medias: result });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  }

  // Update
  static updateSocialMedia(req, res) {
    const { name, social_media_url } = req.body;

    SocialMedia.update(
      {
        name,
        social_media_url,
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
          social_media: result[1][0],
        };

        return res.status(200).json(response);
      })
      .catch((err) => {
        if (err instanceof ValidationError == false) {
          return res.status(500).json({ error: true, message: err });
        } else {
          const message = [];
          err.errors.forEach((error) => {
            message.push({
              key: error.path,
              msg: error.message,
            });
          });
          return res.status(400).json({ message: message });
        }
      });
  }

  // Delete
  static deleteSocialMedia(req, res) {
    SocialMedia.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        return res
          .status(200)
          .json({ message: "Your social media has been successfully deleted" });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
}

module.exports = SocialMediaController;
