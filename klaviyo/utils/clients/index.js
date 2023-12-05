const { default: mongoose } = require("mongoose");
const axios = require("axios");
const res = require("express/lib/response");
require("dotenv").config();

const MongoClient = (callback) =>
  mongoose
    .connect("mongodb://localhost:27017/users")
    .then(() => {
      return callback();
    })
    .catch((err) => {
      return callback(err);
    });

const ApiCall = async ({ endpoint, method, body = {}, header, params }) => {
  console.log(`${process.env.REACT_APP_BASE_URL}/${endpoint}`, method);

  try {
    let config = {
      method: method,
      url: `${process.env.REACT_APP_BASE_URL}/${endpoint}`,
      headers: {
        Authorization: process.env.REACT_APP_API_KEY,
        accept: "application/json",
        "content-type": "application/json",
        revision: "2023-10-15",
      },
      data: body,
    };
    const response = await axios.request(config);
    //console.log("response for apiCall:", response);
    return response;
  } catch (err) {
    //console.log("==>>> ERROR ApiCLient: ", err);
    return err;
  }
};

module.exports = {
  MongoClient,
  ApiCall,
};
