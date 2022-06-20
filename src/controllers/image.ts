import Clarifai from "clarifai";
import { Request, Response } from "express";
import { Knex } from "knex";

export const app = new (Clarifai as any).App({
  apiKey: "dbb0c8898bb742b28e95d774851aed63",
});

export const handleApiCall = (req: Request, res: Response) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data: any) => {
      res.json(data);
    })
    .catch((err: any) => res.status(400).json("unable to work with API"));
};

export const handleImage = (req: Request, res: Response, db: Knex) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};
