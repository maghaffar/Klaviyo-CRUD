const User = require("../mongodb/user-schema.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const age = 1 * 24 * 60 * 60;
const createToken = (id) => {
  const jwtValue = JSON.stringify(id);
  return jwt.sign({ jwtValue }, process.env.REACT_APP_SECRET, {
    expiresIn: age,
  });
};

const signUp = async (req, res) => {
  const { data } = req.body;

  let isEmailExist = await User.find({ email: data.email });
  if (isEmailExist.length !== 0) {
    res.status(400).json({ err: "Email already exists" });
    return;
  }

  try {
    const user = await User.create(data);
    const token = createToken(user._id);
    // res.cookie("jwt", token, { maxAge: age * 1000 });
    res.status(201).json({ user: user, token: token });
  } catch (err) {
    console.log("catch", err);
    res.status(400).json({ err: err.message });
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  let passwordMatched = false;
  let token;
  try {
    let user = await User.findOne({ email });
    if (user) {
      passwordMatched = await bcrypt.compare(password, user.password);
      token = createToken(user._id);
    }

    if (passwordMatched) {
      res.status(200).json({ res: 1, token: token });
    } else {
      res.status(200).json({ res: 0 });
    }
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

module.exports = {
  signUp,
  logIn,
};
