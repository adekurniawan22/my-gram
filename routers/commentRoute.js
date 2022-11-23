const CommentController = require("../controllers/commentController");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/commentAuthorization");
const router = require("express").Router();

router.use(authentication);

router.post("/comments", CommentController.createComment);
router.get("/comments", CommentController.getAllComment);

router.use("/comments/:id", authorization);

router.put("/comments/:id", CommentController.updateComment);
router.delete("/comments/:id", CommentController.deleteComment);

module.exports = router;
