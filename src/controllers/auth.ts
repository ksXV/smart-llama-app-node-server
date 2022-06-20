import { NextFunction, Request, Response } from "express";
import { redisClient } from "./signin";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send("Unauthorized");
  }
  return redisClient.get(authorization).then((reply) => {
    if (reply === null) {
      return res.status(401).send("Unauthorized");
    }
    return next();
  });
};

export default requireAuth;
