"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const signin_1 = require("./signin");
const handleRegister = (req, res, db) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return Promise.reject("incorrect form submission");
    }
    // var salt = bcrypt.genSaltSync(10);
    const hash = (0, bcrypt_1.hashSync)(password, 10);
    db.transaction((trx) => {
        trx
            .insert({
            hash: hash,
            email: email,
        })
            .into("login")
            .returning("email")
            .then((loginEmail) => {
            return trx("users")
                .returning("*")
                .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date(),
            })
                .then((user) => createSession(user[0]).then((session) => res.status(200).json(session)));
        })
            .then(trx.commit)
            .catch(trx.rollback);
    }).catch((err) => res.status(400).json("unable to register"));
};
//First we create the token
const registerToken = (payload) => {
    const jwtPayload = { payload };
    return jsonwebtoken_1.default.sign(jwtPayload, "JWT_SECRET_KEY", { expiresIn: "2 days" });
};
//This stores the token to redis db
const setToken = (key, value) => {
    return Promise.resolve(signin_1.redisClient.set(key, value));
};
//This gets the auth token from redis and verifies if it exists if not it will error out
const createSession = (user) => {
    const { email, id } = user;
    const token = registerToken(email);
    return setToken(token, id)
        .then(() => {
        return { success: "true", userId: id, token: token };
    })
        .catch(console.log);
};
exports.default = handleRegister;
