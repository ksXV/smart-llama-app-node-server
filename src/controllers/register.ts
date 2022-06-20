import jwt from "jsonwebtoken";
import { Knex } from "knex";
import { Request, Response } from "express";
import { hashSync } from "bcrypt";
import { LoginDB, RegisterCredentials, User } from "../types/types";
import { redisClient } from "./signin";

const handleRegister = (
  req: Request,
  res: Response,
  db: Knex<User | LoginDB>
) => {
  const { email, name, password }: RegisterCredentials = req.body;
  if (!email || !name || !password) {
    return Promise.reject("incorrect form submission");
  }
  // var salt = bcrypt.genSaltSync(10);
  const hash = hashSync(password, 10);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail: { email: string }[]) => {
        return trx<User>("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) =>
            createSession(user[0] as unknown as User).then((session) =>
              res.status(200).json(session)
            )
          );
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
};
//First we create the token
const registerToken = (payload: string) => {
  const jwtPayload = { payload };
  return jwt.sign(jwtPayload, "JWT_SECRET_KEY", { expiresIn: "2 days" });
};

//This stores the token to redis db
const setToken = (key: string, value: string | number) => {
  return Promise.resolve(redisClient.set(key, value));
};
//This gets the auth token from redis and verifies if it exists if not it will error out
const createSession = (user: User) => {
  const { email, id } = user;
  const token = registerToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token: token };
    })
    .catch(console.log);
};

export default handleRegister;
