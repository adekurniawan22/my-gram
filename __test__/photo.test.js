const { sequelize } = require("../models");
const request = require("supertest");
const app = require("../app");
const { generateToken } = require("../helpers/jwt");

let token = "";
let wrongToken = "token salah";

let photoId = "";
let wrongPhotoId = 123;

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

const photoData = {
  id: 1,
  title: "Photo Mas Firman",
  caption: "Foto  remaja",
  poster_image_url: "http://photomasfirman.com",
  UserId: 1,
};

const wrongPhotoData = {
  title: "",
  caption: "",
  poster_image_url: "",
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

/**
 * Test createPhoto
 */
describe("POST - sukses /photos", () => {
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/photos")
      .set("token", token)
      .send(photoData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }
        photoId = res.body.id;
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("title");
        expect(res.body).toHaveProperty("caption");
        expect(res.body).toHaveProperty("poster_image_url");
        expect(res.body).toHaveProperty("UserId");
        expect(res.body.title).toEqual(photoData.title);
        done();
      });
  });
});

describe("POST - failed /photos", () => {
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/photos")
      .set("token", token)
      .send(wrongPhotoData)
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
 * Test getAllPhotos
 */
describe("GET - sukses /photos", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .get("/photos")
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("photos");
        expect(Array.isArray(res.body.photos)).toEqual(true);
        expect(res.body.photos[0]).toHaveProperty("id");
        expect(res.body.photos[0]).toHaveProperty("title");
        expect(res.body.photos[0]).toHaveProperty("caption");
        expect(res.body.photos[0]).toHaveProperty("poster_image_url");
        expect(res.body.photos[0]).toHaveProperty("UserId");
        done();
      });
  });
});

/**
 * Test getAllPhotos
 */
 describe("GET - failed /photos", () => {
  it("should send response with 401 status code", (done) => {
    request(app)
      .get("/photos")
      .set("token", wrongToken)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty("message");
        done();
      });
  });
});


/**
 * Test putPhotos
 */
describe("PUT - sukses /photos/:id", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .put(`/photos/${photoId}`)
      .set("token", token)
      .send(photoData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty("photo");
        expect(res.body.photo).toHaveProperty("id");
        expect(res.body.photo).toHaveProperty("poster_image_url");
        expect(res.body.photo).toHaveProperty("title");
        expect(res.body.photo).toHaveProperty("caption");
        expect(res.body.photo).toHaveProperty("UserId");
        done();
      });
  });
});

describe("PUT - failed /photos/:id", () => {
  it("should send response with 404 status code", (done) => {
    request(app)
      .put(`/photos/${wrongPhotoId}`)
      .set("token", token)
      .send(photoData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Photo not found");
        done();
      });
  });
});


/**
 * Test deletePhotos
 */
describe("DELETE - sukses /photos/:id", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/photos/${photoId}`)
      .set("token", token)
      .send(photoData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual(
          "Your photo has been successfully deleted"
        );
        done();
      });
  });
});

describe("DELETE - failed /photos/:id", () => {
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete(`/photos/${wrongPhotoId}`)
      .set("token", token)
      .send(photoData)
      .end(function (err, res) {
        if (err) {
          done(err);
        }

        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Photo not found");
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
    .bulkDelete("Photos", {})
    .then(() => {
      return done();
    })
    .catch((err) => {
      done(err);
    });
});
