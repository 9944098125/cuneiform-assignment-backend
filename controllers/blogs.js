const Blog = require("../models/Blog");
const User = require("../models/User");

const createBlog = async (req, res, next) => {
  const { userId } = req.params;
  // I have included the userId and with this we can do many more things
  // such as declaring the user who posted the blog and all
  try {
    const postingUser = await User.findOne({ _id: userId });
    console.log(postingUser);
    const createdBlog = new Blog({
      ...req.body,
    });
    // creating the blog with the request received
    await createdBlog.save();
    res.status(201).json({
      message: `Blog created by ${postingUser.first_name} successfully`,
      blog: {
        newBlog: createdBlog,
        username: postingUser.first_name,
        profilePicture: postingUser.profilePicture,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getBlogs = async (req, res, next) => {
  try {
    // getting all the blogs
    const blogs = await Blog.find();
    res.status(200).json({
      message: "Blogs fetched successfully",
      blogs: blogs,
    });
  } catch (err) {
    next(err);
  }
};

const editBlog = async (req, res, next) => {
  const { blogId, userId } = req.params;
  try {
    const users = await User.find();
    const editingUser = users.filter((user) => user._id === userId);
    if (editingUser) {
      // here we are updating the blog with blog id
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json({
        message: "Blog updated successfully",
        blog: {
          updatedBlog: updatedBlog,
          username: editingUser.first_name,
          profilePicture: editingUser.profilePicture,
        },
      });
    } else {
      return res
        .status(400)
        .json({ message: "You are not authorized to update this blog" });
    }
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req, res, next) => {
  const { blogId, userId } = req.params;
  try {
    const users = await User.find();
    const deletingUser = users.filter((user) => user._id === userId);
    if (deletingUser) {
      await Blog.findByIdAndDelete({ _id: blogId });
    } else {
      return res
        .status(400)
        .json({ message: "You are not allowed to delete this blog" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { createBlog, getBlogs, editBlog, deleteBlog };
