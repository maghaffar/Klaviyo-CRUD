const { ApiCall } = require("../utils/clients");

const createProfile = async (req, res) => {
  const data = req.body;
  try {
    response = await ApiCall({
      method: "post",
      endpoint: "profiles/",
      body: data,
    });
    res.status(201).json({ res: response.data });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports = {
  createProfile,
};
