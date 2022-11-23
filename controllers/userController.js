const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");
const { ValidationError } = require("sequelize");

class UserController {
  //Register
  static register(req, res) {
    const {
      full_name,
      email,
      username,
      password,
      profile_image_url,
      age,
      phone_number,
    } = req.body;

    User.create({
      full_name,
      email,
      username,
      password,
      profile_image_url,
      age,
      phone_number,
    })
      .then((result) => {
        let response = {
          user: {
            full_name,
            email,
            username,
            profile_image_url,
            age: result.age,
            phone_number: result.phone_number,
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

  //login
  static login(req, res) {
    const { email, password } = req.body;
    User.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
        if (!user) {
          throw {
            code: 401,
            name: "User Login Error",
          };
        }
        const isCorrect = comparePassword(password, user.password);
        if (!isCorrect) {
          throw {
            code: 401,
            name: "User Login Error",
            devMessage: `User's password with email "${email}" does not match`,
          };
        }
        let payload = {
          id: user.id,
          email: user.email,
        };

        const token = generateToken(payload);

        return res.status(200).json({ token });
      })
      .catch((err) => {
        return res.status(401).json(err);
      });
  }

  // Update

  static update(req, res) {
    let { full_name, email, username, profile_image_url, age, phone_number } =
      req.body;

    User.update(
      {
        full_name,
        email,
        username,
        profile_image_url,
        age,
        phone_number,
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
          user: {
            full_name,
            email,
            username,
            profile_image_url,
            age: result[1][0].age,
            phone_number: result[1][0].phone_number,
          },
        };

        return res.status(200).json(response);
      })
      .catch((err) => {
        if (err instanceof ValidationError == false) {
          res.status(500).json({ error: true, message: err });
        } else {
          const message = [];
          err.errors.forEach((error) => {
            return message.push({
              key: error.path,
              msg: error.message,
            });
          });
          return res.status(400).json({ message: message });
        }
      });
  }

  /**
   * Delete
   */
  static delete(req, res) {
    User.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((result) => {
        return res
          .status(200)
          .json({ message: "Your account has been successfully deleted" });
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
}

module.exports = UserController;
