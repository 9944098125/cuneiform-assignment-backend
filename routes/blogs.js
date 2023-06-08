const router = require("express").Router();

const {
  createBlog,
  getBlogs,
  editBlog,
  deleteBlog,
} = require("../controllers/blogs");

router.route("/createBlog/:userId").post(createBlog);

router.route("/getBlogs").get(getBlogs);

router.route("/editBlog/:blogId/:userId").patch(editBlog);

router.route("/deleteBlog/:blogId/:userId").delete(deleteBlog);

module.exports = router;
