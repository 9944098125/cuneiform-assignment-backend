const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const register = async (req, res, next) => {
  const { first_name, last_name, email, password, profilePicture } = req.body;
  try {
    // checking if any user with this mail exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    } else {
      // encrypting the password with bcryptjs
      const encryptedPassword = await bcrypt.hashSync(password, 12);
      const savedUser = new User({
        first_name,
        last_name,
        email,
        password: encryptedPassword,
        profilePicture,
      });
      await savedUser.save();
      res
        .status(201)
        .json({ message: "Registration Success", user: savedUser });
    }
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // checking if the user with this email exists
    const validUser = await User.findOne({ email });
    // comparing the passwords
    if (!validUser || !(await bcrypt.compare(password, validUser.password))) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }
    const token = jwt.sign({ userId: validUser._id }, process.env.JWT_KEY);
    res.status(200).json({
      message: "Login Success",
      user: validUser,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
