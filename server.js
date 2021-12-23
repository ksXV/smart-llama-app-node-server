const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: {
    host: "postgresql-horizontal-67871",
    user: "postgres",
    password: "admin",
    database: "smart-brain",
  },
});
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

db.select("*").from("users");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => res.send("hellooooo"));
app.post("/signin", signin.handleSignIn(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.put("/profile-picture", profile.updateProfilePicture(db));
app.put("/image", image.updateEntries(db));
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
