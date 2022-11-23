const { generateToken, verifyToken } = require("../helpers/jwt");
const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

const registerData = {
  email: "firman@gmail.com",
  full_name: "Firman Ramadhan",
  username: "firman19",
  password: "19112001",
  profile_image_url: "http://photofirman.com",
  age: 21,
  phone_number: "081284858",
};

const wrongRegisterData = {
  email: "",
  full_name: "",
  username: "",
  password: "",
  profile_image_url: "",
  age: "",
  phone_number: "",
};

/**
 * Test registerUser
 */

describe("POST - sukses /users/register", () => {
  it("Should send response with 201 status code", (done) => {
    request(app)
      .post("/users/register")
      .send(registerData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("email");
        expect(res.body.user).toHaveProperty("full_name");
        expect(res.body.user).toHaveProperty("username");
        expect(res.body.user).toHaveProperty("profile_image_url");
        expect(res.body.user).toHaveProperty("age");
        expect(res.body.user).toHaveProperty("phone_number");
        expect(res.body.user.email).toEqual(registerData.email);
        done();
      });
  });
});

describe("POST - failed /users/register", () => {
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/users/register")
      .send(wrongRegisterData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty("message");
        done();
      });
  });
});

/**
 * Test loginUser
 */

let token = "";
let wrongToken = "token salah";

const wrongLoginData = {
  email: "zahra@gmail.com",
  password: "123456",
};

describe("POST - sukses /users/login", () => {
  it("Should send response with 201 status code", (done) => {
    request(app)
      .post("/users/login")
      .send(registerData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        token = res.body.token;
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toEqual("string");
        expect(verifyToken(token)).toHaveProperty("id");
        expect(verifyToken(token)).toHaveProperty("email");
        done();
      });
  });
});

describe("POST - failed /users/login", () => {
  it("Should send response with 401 status code", (done) => {
    request(app)
      .post("/users/login")
      .send(wrongLoginData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name");
        expect(typeof res.body.name).toEqual("string");
        expect(res.body.name).toEqual("User Login Error");
        done();
      });
  });
});

/**
 * Test updateUser
 */

describe("PUT  - sukses /users/:id", () => {
  it("Should send response with 200 status code", (done) => {
    request(app)
      .put(`/users/${verifyToken(token).id}`)
      .set("token", token)
      .send(registerData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("email");
        expect(res.body.user).toHaveProperty("full_name");
        expect(res.body.user).toHaveProperty("username");
        expect(res.body.user).toHaveProperty("profile_image_url");
        expect(res.body.user).toHaveProperty("age");
        expect(res.body.user).toHaveProperty("phone_number");
        expect(res.body.user.email).toEqual(registerData.email);
        done();
      });
  });
});

describe("PUT - failed /users/:id", () => {
  it("Should send response with 200 status code", (done) => {
    request(app)
      .put(`/users/123`)
      .set("token", token)
      .send(registerData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("access denied");
        done();
      });
  });
});

/**
 * Test deleteUser
 */

describe("Delete - sukses /users/:id", () => {
  it("Should send response with 200 status code", (done) => {
    request(app)
      .delete(`/users/${verifyToken(token).id}`)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual(
          "Your account has been successfully deleted"
        );
        done();
      });
  });
});

describe("Delete - failed /users/:id", () => {
  it("Should send response with 401 status code", (done) => {
    request(app)
      .delete(`/users/${wrongToken}`)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("devMessage");
        expect(typeof res.body.devMessage).toEqual("string");
        done();
      });
  });
});

afterAll((done) => {
  sequelize.queryInterface
    .bulkDelete("Users", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });
});
