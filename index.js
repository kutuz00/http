const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");

const network = os.networkInterfaces();
const app = express();

const port = 3000;

// Route for /get endpoint. Exercise 1
app
  .route("/get")
  .get((req, res) => {
    try {
      fs.readdirSync(path.join(__dirname + "/files"));
    } catch (err) {
      res.status(500).send("Internal server error");
    } finally {
      res
        .status(200)
        .send(fs.readdirSync(path.join(__dirname + "/files")).join(", "));
    }
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

//Route for delete endpoint. Exercise 2
app
  .route("/delete")
  .delete((req, res) => {
    res.status(200).send("success");
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

//Route for post endpoint. Exercise 2
app
  .route("/post")
  .post((req, res) => {
    res.status(200).send("success");
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

//Route for /reditect endpoint. Exercise 3
app
  .route("/redirect")
  .get((req, res) => {
    res.status(308).location("/redirected");
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

//Error 404
app.use((req, res) => res.status(404).send("Not Found!"));

app.listen(port);
console.log(`Server running at http://${network.en1[1].address}:${port}`);
