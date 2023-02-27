// TODO: assign all routes
const router = require("express").router();
const userRoutes = require("");
const postRoutes = require("");
const commentRoutes = require("");

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
