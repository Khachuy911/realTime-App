const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 9000;
const connect = require("./Config/database");
const route = require("./Routers/index");

app.use(express.urlencoded());
app.use(express.json());
// connect with database
connect();

//set route
route(app);

app.listen(port, () => {
  console.log(`Server start with http://localhost:${port}`);
});
