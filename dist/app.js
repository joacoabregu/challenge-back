"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const coupons_controller_1 = require("./controllers/coupons.controller");
const stats_controller_1 = require("./controllers/stats.controller");
const stores_controller_1 = require("./controllers/stores.controller");
const app = express_1.default();
typeorm_1.createConnection();
// Coupons Routes
app.get("/coupons", coupons_controller_1.getCoupons);
app.post("/coupons", coupons_controller_1.createCoupon);
app.patch("/coupons", coupons_controller_1.validateEmailCoupon, coupons_controller_1.updateCoupon);
app.delete("/coupons", coupons_controller_1.deleteCoupon);
// Stats Route
app.get("/coupons/stats", stats_controller_1.getStats);
// Stores Routes
app.get("/stores", stores_controller_1.getStore, stores_controller_1.getStores);
app.post("/stores", stores_controller_1.createStore);
app.delete("/stores", stores_controller_1.deleteStore);
app.listen(process.env.PORT);
