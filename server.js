const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
// const db = knex({
//   client: "pg",
//   version: "7.2",
//   connection: {
//     host: "127.0.0.1",
//     port: 5432,
//     user: "postgres",
//     password: "admin",
//     database: "smart-brain",
//   },
// });
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

db.select("*").from("users");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello");
});
app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});
app.listen(process.env.PORT || 3000);
// app.get("/profile/:id", (req, res) => {
//   const { id } = req.params;
//   db.select("*")
//     .from("users")
//     .where({
//       id: id,
//     })
//     .then((user) => {
//       if (user.length) {
//         res.json(user[0]);
//       } else {
//         res.status(404).json("Not found");
//       }
//     })
//     .catch((err) => res.status(404).json("error getting the user"));
// });
