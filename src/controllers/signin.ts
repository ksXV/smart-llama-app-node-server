import jwt from "jsonwebtoken";
import { createClient } from "redis";

import { compareSync } from "bcrypt";

import { Knex } from "knex";

import { Request, Response } from "express";
import { User } from "../types/types";

export const redisClient = createClient();

async function main(): Promise<void> {
  await redisClient.connect();
  redisClient.on("error", (err: Error) =>
    console.log("Redis Client Error", err)
  );
}
main().catch(console.log);

const handleSignin = (db: Knex, req: Request, res: Response): Promise<User> => {
  const { email, password }: { email: string; password: string } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data: { hash: string }[]) => {
      const isValid = compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user: User[]) => user[0])
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        return Promise.reject("wrong credentials");
      }
    })
    .catch((err) => err);
};

const getAuthTokenId = (req: Request, res: Response) => {
  const { authorization } = req.headers;
  if (authorization === undefined)
    return res.status(404).json("Error getting the auth");
  return redisClient.get(authorization).then((reply) => {
    if (reply === null) {
      return res.status(401).send("Unauthorized");
    }
    return res.json({ id: reply });
  });
};

const signToken = (username: string) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, "JWT_SECRET_KEY", { expiresIn: "2 days" });
};

const setToken = (key: string, value: string | number) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSession = (user: User) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token: token };
    })
    .catch(console.log);
};

const signinAuthentication = (db: Knex) => (req: Request, res: Response) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignin(db, req, res)
        .then((data) =>
          data.id && data.email ? createSession(data) : Promise.reject(data)
        )
        .then((session) => {
          return res.json(session);
        })
        .catch((err) => res.status(400).json(err));
};

export default signinAuthentication;
