require("dotenv").config();
import express from "express";
import { createConnection } from "typeorm";
import { createCoupon, getCoupons, updateCoupon } from "./controllers/coupons.controller";

const app = express();
createConnection();

app.get("/coupons", getCoupons);
app.post("/coupons", createCoupon);
app.patch("/coupons", updateCoupon);


app.listen(process.env.PORT);
