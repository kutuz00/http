const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

const network = os.networkInterfaces();
const app = express();

const port = 3000;
const cookieLenght = 1000 * 60 * 60 * 24 * 2;
const user = {
  id: 123,
  username: "testuser",
  password: "qwerty",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app
  .route("/auth")
  .post((req, res) => {
    if (
      req.body.username === user.username &&
      req.body.password === user.password
    ) {
      res
        .status(200)
        .cookie("userId", user.id, {
          expires: new Date(Date.now() + cookieLenght),
        })
        .cookie("authorized", true, {
          expires: new Date(Date.now() + cookieLenght),
        })
        .send("OK");
    } else res.status(400).send("Неверный логин или пароль");
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

app
  .route("/get")
  .get((req, res) => {
    try {
      fs.readdirSync(path.join(__dirname + "/files"));
      res
        .status(200)
        .send(fs.readdirSync(path.join(__dirname + "/files")).join(", "));
    } catch (err) {
      res.status(500).send("500 - Internal server error");
    }
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

app
  .route("/delete")
  .delete((req, res) => {
    if (
      parseInt(req.cookies.userId) === user.id &&
      req.cookies.authorized === "true"
    ) {
      try {
        fs.unlinkSync(path.join(__dirname + "/files/" + req.body.filename));
        res.status(200).send(`File ${req.body.filename} is deleted!`);
      } catch (err) {
        throw res.status(500).type("html").send("500 - Internal server error");
      }
    } else res.status(401).type("html").send("401 - Not authorized!");
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

app
  .route("/post")
  .post((req, res) => {
    if (
      parseInt(req.cookies.userId) === user.id &&
      req.cookies.authorized === "true"
    ) {
      try {
        fs.writeFileSync(
          path.join(__dirname + "/files/" + req.body.filename),
          req.body.content
        );
        res
          .status(200)
          .send(`File ${req.body.filename} with ${req.body.content} created!`);
      } catch (err) {
        console.log(err.info);
        throw res.status(500).type("html").send("500 - Internal server error");
      }
    } else res.status(401).type("html").send("401 - Not authorized!");
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

app
  .route("/redirect")
  .get((req, res) => {
    res.status(308).location("/redirected");
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

app
  .route("/redirected")
  .get((req, res) => {
    res.status(200).send("Redirected Location");
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

app
  .route("/logout")
  .get((req, res) => {
    res
      .clearCookie("userId", "authorized", { path: "/" })
      .status(200)
      .send("You have logout!");
  })
  .all((req, res) => res.status(405).send("HTTP method not allowed"));

app.use((req, res) => res.status(404).send("Not Found!"));

app.listen(port);
console.log(`Server running at http://${network.en1[1].address}:${port}`);
