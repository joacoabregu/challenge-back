require("dotenv").config();
import express from "express";
import { createConnection } from "typeorm";
import { getCoupons } from "./controllers/coupons.controller";

const app = express();
createConnection();

app.get("/coupons", getCoupons);

app.listen(process.env.PORT);
