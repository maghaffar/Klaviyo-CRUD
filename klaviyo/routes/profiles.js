const express = require("express");
const profile = express.Router();
const { createProfile } = require("../controllers/profile.js");

profile.post("/", createProfile);

module.exports = profile;
