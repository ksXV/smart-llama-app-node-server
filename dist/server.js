"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const register_1 = __importDefault(require("./controllers/register"));
const signin_1 = __importDefault(require("./controllers/signin"));
const profile_1 = __importDefault(require("./controllers/profile"));
const image_1 = require("./controllers/image");
const updateProfile_1 = __importDefault(require("./controllers/updateProfile"));
const auth_1 = __importDefault(require("./controllers/auth"));
const app = (0, express_1.default)();
const db = (0, knex_1.default)({
    client: "pg",
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
// const db = knex({
//   client: "pg",
//   version: "7.2",
//   connection: {
//     host: "127.0.0.1" || process.env.POSTGRES_HOST,
//     port: 5432,
//     user: "postgres" || process.env.POSTGRES_USER,
//     password: "admin" || process.env.POSTGRES_PASSWORD,
//     database: "smart-brain" || process.env.POSTGRES_DB,
//   },
// });
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signin", (0, signin_1.default)(db));
app.post("/register", (req, res) => {
    (0, register_1.default)(req, res, db);
});
app.get("/profile/:id", auth_1.default, (req, res) => {
    (0, profile_1.default)(req, res, db);
});
app.put("/image", auth_1.default, (req, res) => {
    (0, image_1.handleImage)(req, res, db);
});
app.post("/imageurl", auth_1.default, (req, res) => {
    (0, image_1.handleApiCall)(req, res);
});
app.put("/update-profile/:id", auth_1.default, (req, res) => {
    (0, updateProfile_1.default)(req, res, db);
});
app.listen(process.env.PORT || 3000);
