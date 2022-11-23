const { sequelize } = require("../models");
const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");

let token = "";
let wrongToken = "token salah";


let socialMediaId = "";
let wrongSocialMediaId = 797;

const userData = {
  id: 1,
  email: "firman@gmail.com",
  full_name: "Firman Ramadhan",
  username: "firman19",
  password: "19112001",
  profile_image_url: "http://photofirman.com",
  age: 21,
  phone_number: "081284858",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const wrongUserData = {
  id: "",
  email: "",
  full_name: "",
  username: "",
  password: "",
  profile_image_url: "",
  age: "",
  phone_number: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const socialMediaData = {
  id: 1,
  name: "Firman Ramadhan",
  social_media_url: "http://firmann19.com",
  UserId: 1,
};

const wrongSocialMediaData = {
  id: "",
  name: "",
  social_media_url: "",
  UserId: "",
};

beforeAll((done) => {
  sequelize.queryInterface
    .bulkInsert("Users", [userData], {})
    .then(() => {
      token = generateToken({
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        username: userData.username,
        password: userData.password,
        profile_image_url: userData.profile_image_url,
        age: userData.age,
        phone_number: userData.phone_number,
      });
      return done();
    })
    .catch((err) => {
      done(err);
    });
});

//Success
describe("POST - sukses /photos", () => {
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("token", token)
      .send(socialMediaData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        socialMediaId = res.body.social_media.id;
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty("social_media");
        expect(res.body.social_media).toHaveProperty("id");
        expect(res.body.social_media).toHaveProperty("name");
        expect(res.body.social_media).toHaveProperty("UserId");
        done();
      });
  });
});

//Failed
describe("POST - Failed /photos", () => {
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("token", token)
      .send(wrongSocialMediaData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        done();
      });
  });
});

/**
 * Test getAllSocialMedia
 */

//Success
describe("GET - sukses /socialMedia", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .get("/socialmedias")
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("social_medias");
        expect(Array.isArray(res.body.social_medias)).toEqual(true);
        expect(res.body.social_medias[0]).toHaveProperty("id");
        expect(res.body.social_medias[0]).toHaveProperty("name");
        expect(res.body.social_medias[0]).toHaveProperty("social_media_url");
        expect(res.body.social_medias[0]).toHaveProperty("UserId");
        done();
      });
  });
});

//Failed
describe("GET - failed /socialMedia", () => {
  it("should send response with 401 status code", (done) => {
    request(app)
      .get("/socialmedias")
      .set("token", wrongToken)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(401);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        done();
      });
  });
});

/**
 * Test putSocialMedia
 */

//Success
describe("PUT /socialmedias/:id", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .put(`/socialmedias/${socialMediaId}`)
      .set("token", token)
      .send(socialMediaData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("social_media");
        expect(res.body.social_media).toHaveProperty("id");
        expect(res.body.social_media).toHaveProperty("social_media_url");
        expect(res.body.social_media).toHaveProperty("name");
        expect(res.body.social_media).toHaveProperty("UserId");
        done();
      });
  });
});

//Failed
describe("PUT - Failed /socialmedias/:id", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .put(`/socialmedias/${wrongSocialMediaId}`)
      .set("token", token)
      .send(socialMediaData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Social media not found");
        done();
      });
  });
});


/**
 * Test deleteSocialMedia
 */

//Success
describe("DELETE /socialmedias/:id", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/socialmedias/${socialMediaId}`)
      .set("token", token)
      .send(socialMediaData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual(
          "Your social media has been successfully deleted"
        );
        done();
      });
  });
});

//Failed
describe("DELETE - Failed /socialmedias/:id", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/socialmedias/${wrongSocialMediaId}`)
      .set("token", token)
      .send(socialMediaData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Social media not found");
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

  sequelize.queryInterface
    .bulkDelete("SocialMedia", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });
});
