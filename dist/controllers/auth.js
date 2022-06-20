"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signin_1 = require("./signin");
const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).send("Unauthorized");
    }
    return signin_1.redisClient.get(authorization).then((reply) => {
        if (reply === null) {
            return res.status(401).send("Unauthorized");
        }
        return next();
    });
};
exports.default = requireAuth;
