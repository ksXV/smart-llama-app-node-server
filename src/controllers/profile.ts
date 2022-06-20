import { Request, Response } from "express";
import { Knex } from "knex";
const handleProfileGet = (req: Request, res: Response, db: Knex) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
};

export default handleProfileGet;
