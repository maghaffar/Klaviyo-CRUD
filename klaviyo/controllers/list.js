const { ApiCall } = require("../utils/clients");

const getLists = async (req, res) => {
  try {
    const response = await ApiCall({ endpoint: "lists/", method: "GET" });
    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

const deleteList = async (req, res) => {
  const { token } = req.body;
  try {
    const response = await ApiCall({
      endpoint: `lists/${req.params.id}/`,
      method: "delete",
    });
    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

const createList = async (req, res) => {
  const { data } = req.body;
  console.log("===>>> goind to create list", { data });
  try {
    const response = await ApiCall({
      method: "post",
      endpoint: "lists/",
      body: { data },
    });
    //console.log("====>>>>>> create", response);
    res.status(201).json({ data: response.data });
  } catch (err) {
    //console.error("==>> ERROR create list controller: ", err);
    res.status(400).json({ err: err });
  }
};

const addProfileToList = async (req, res) => {
  const { listId, data } = req.body;
  try {
    const response = await ApiCall({
      method: "post",
      endpoint: `lists/${listId}/relationships/profiles/`,
      body: data,
    });
    res.status(201).json({ res: response.data });
  } catch (err) {
    res.status(404).json({ err: err });
  }
};
const getProfiles = async (req, res) => {
  try {
    const response = await ApiCall({
      method: "get",
      endpoint: `lists/${req.params.id}/profiles/`,
    });
    res.status(200).json({ data: response.data });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

const removeProfileFromList = async (req, res) => {
  const { listId, data } = req.body;
  try {
    console.log("=====", listId);
    const response = await ApiCall({
      endpoint: `lists/${listId}/relationships/profiles/`,
      method: "DELETE",
      body: data,
    });
    res.status(200).json({ res: response.data });
  } catch (err) {
    res.status(404).json({ err: err });
  }
};
module.exports = {
  getLists,
  deleteList,
  createList,
  getProfiles,
  addProfileToList,
  removeProfileFromList,
};
