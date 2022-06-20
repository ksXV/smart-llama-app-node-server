"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("redis");
const bcrypt_1 = require("bcrypt");
exports.redisClient = (0, redis_1.createClient)();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.redisClient.connect();
        exports.redisClient.on("error", (err) => console.log("Redis Client Error", err));
    });
}
main().catch(console.log);
const handleSignin = (db, req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject("incorrect form submission");
    }
    return db
        .select("email", "hash")
        .from("login")
        .where("email", "=", email)
        .then((data) => {
        const isValid = (0, bcrypt_1.compareSync)(password, data[0].hash);
        if (isValid) {
            return db
                .select("*")
                .from("users")
                .where("email", "=", email)
                .then((user) => user[0])
                .catch((err) => res.status(400).json("unable to get user"));
        }
        else {
            return Promise.reject("wrong credentials");
        }
    })
        .catch((err) => err);
};
const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    if (authorization === undefined)
        return res.status(404).json("Error getting the auth");
    return exports.redisClient.get(authorization).then((reply) => {
        if (reply === null) {
            return res.status(401).send("Unauthorized");
        }
        return res.json({ id: reply });
    });
};
const signToken = (username) => {
    const jwtPayload = { username };
    return jsonwebtoken_1.default.sign(jwtPayload, "JWT_SECRET_KEY", { expiresIn: "2 days" });
};
const setToken = (key, value) => {
    return Promise.resolve(exports.redisClient.set(key, value));
};
const createSession = (user) => {
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
        return { success: "true", userId: id, token: token };
    })
        .catch(console.log);
};
const signinAuthentication = (db) => (req, res) => {
    const { authorization } = req.headers;
    return authorization
        ? getAuthTokenId(req, res)
        : handleSignin(db, req, res)
            .then((data) => data.id && data.email ? createSession(data) : Promise.reject(data))
            .then((session) => {
            return res.json(session);
        })
            .catch((err) => res.status(400).json(err));
};
exports.default = signinAuthentication;
