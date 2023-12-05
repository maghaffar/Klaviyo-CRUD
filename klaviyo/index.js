const express = require("express");
const app = express();
const cors = require("cors");
const port = 5001;
const list = require("./routes/lists.js");
const profile = require("./routes/profiles.js");
const { MongoClient } = require("./utils/clients/index.js");
const user = require("./routes/users.js");
const cookieParser = require("cookie-parser");
const authMiddlewear = require("./middlewares/auth");
app.use(cors("*"));
app.use(express.json());
app.use(cookieParser());
app.use("/user", user);
app.use(authMiddlewear);
app.use("/lists", list);
app.use("/profiles", profile);

MongoClient((err) => {
  if (!err) {
    console.log("Database Connected");
  }
});
app.listen(port, () => {
  console.log(`listenig on port ${port}`);
});
