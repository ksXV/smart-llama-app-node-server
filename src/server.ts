import knex from "knex";
import express, { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import cors from "cors";
import morgan from "morgan";

import handleRegister from "./controllers/register";
import signinAuthentication from "./controllers/signin";
import handleProfileGet from "./controllers/profile";
import { handleImage, handleApiCall } from "./controllers/image";
import handleProfileUpdate from "./controllers/updateProfile";
import requireAuth from "./controllers/auth";

// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
// });
const app = express();
const db = knex({
  client: "pg",
  version: "7.2",
  connection: {
    host: "127.0.0.1" || process.env.POSTGRES_HOST,
    port: 5432,
    user: "postgres" || process.env.POSTGRES_USER,
    password: "admin" || process.env.POSTGRES_PASSWORD,
    database: "smart-brain" || process.env.POSTGRES_DB,
  },
});

app.use(morgan("combined"));
app.use(express.json());
app.use(cors());

app.post("/signin", signinAuthentication(db));
app.post("/register", (req: Request, res: Response) => {
  handleRegister(req, res, db);
});
app.get("/profile/:id", requireAuth, (req: Request, res: Response) => {
  handleProfileGet(req, res, db);
});
app.put("/image", requireAuth, (req: Request, res: Response) => {
  handleImage(req, res, db);
});
app.post("/imageurl", requireAuth, (req: Request, res: Response) => {
  handleApiCall(req, res);
});
app.put("/update-profile/:id", requireAuth, (req: Request, res: Response) => {
  handleProfileUpdate(req, res, db);
});

app.listen(process.env.PORT || 3000);
