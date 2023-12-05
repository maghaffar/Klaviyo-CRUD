const jwt = require("jsonwebtoken");
const verifyUser = async (req, res, next) => {
  const { token } = req.body;
  jwt.verify(token, process.env.REACT_APP_SECRET, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ verified: false });
    } else {
      next();
    }
  });
};

module.exports = verifyUser;
