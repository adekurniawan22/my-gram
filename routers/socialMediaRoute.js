const SocialMediaController = require("../controllers/socialMediaController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/socialMediaAuthorization");

const router = require("express").Router();

router.use(authentication);

router.post("/socialmedias", SocialMediaController.createSocialMedia);
router.get("/socialmedias", SocialMediaController.getAllSocialMedia);

router.use("/socialmedias/:id", authorization);

router.put("/socialmedias/:id", SocialMediaController.updateSocialMedia);
router.delete("/socialmedias/:id", SocialMediaController.deleteSocialMedia);

module.exports = router;
