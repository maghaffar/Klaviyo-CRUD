const express = require("express");
const list = express.Router();
const {
  getLists,
  deleteList,
  createList,
  getProfiles,
  addProfileToList,
  removeProfileFromList,
} = require("../controllers/list");

list.post("/", createList);
list.post("/get", getLists);

list.post("/:id/profiles/get", getProfiles);
list.post("/addProfile", addProfileToList);
list.delete("/removeProfile", removeProfileFromList);

list.delete("/:id", deleteList);
module.exports = list;
