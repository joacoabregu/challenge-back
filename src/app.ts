require("dotenv").config();
import express from "express";
import { createConnection } from "typeorm";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
  validateEmailCoupon,
} from "./controllers/coupons.controller";
import {
  createStore,
  deleteStore,
  getStore,
  getStores,
} from "./controllers/stores.controller";

const app = express();
createConnection();

app.get("/coupons", getCoupons);
app.post("/coupons", createCoupon);
app.patch("/coupons", validateEmailCoupon, updateCoupon);
app.delete("/coupons", deleteCoupon);

app.get("/stores", getStore, getStores);
app.post("/stores", createStore);
app.delete("/stores", deleteStore);

app.listen(process.env.PORT);
