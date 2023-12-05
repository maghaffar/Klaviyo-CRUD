const express = require("express");
const router = express.Router();
const { signUp, logIn } = require("../controllers/user");

router.post("/signup", signUp);
router.post("/logIn", logIn);
module.exports = router;
