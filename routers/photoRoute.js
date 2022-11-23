const PhotoController = require("../controllers/photoController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/photoAuthorization");
const router = require("express").Router();

router.use(authentication);

router.post("/photos", PhotoController.createPhoto);
router.get("/photos", PhotoController.GetAllPhoto);

router.use("/photos/:id", authorization);

router.put("/photos/:id", PhotoController.updateFoto);
router.delete("/photos/:id", PhotoController.deleteFoto);

module.exports = router;
