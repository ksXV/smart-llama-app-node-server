import { Request, Response } from "express";
import { Knex } from "knex";
const handleProfileUpdate = (req: Request, res: Response, db: Knex) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;
  db("users")
    .where({ id })
    .update({ name: name })
    .then((resp) => {
      if (resp) {
        res.json("success");
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch((_err: unknown) => res.status(400).json("error updating user"));
};

export default handleProfileUpdate;
