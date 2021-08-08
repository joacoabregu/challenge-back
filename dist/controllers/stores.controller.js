"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStore = exports.createStore = exports.getStores = exports.getStore = void 0;
const typeorm_1 = require("typeorm");
const Store_1 = require("../entity/Store");
const coupon_1 = require("../validators/coupon");
const getStore = async (req, res, next) => {
    let name = req.query.name;
    // If a name wasn't provided pass to next middleware
    if (!name) {
        return next();
    }
    // Find the store and send message if it exists in database
    let repository = typeorm_1.getRepository(Store_1.Stores);
    repository
        .findOne({ name })
        .then((store) => {
        if (!store) {
            res.status(404).send({
                status: "error",
                message: "The provided name doesn't exist in the database",
            });
        }
        else {
            res.send(store);
        }
    })
        .catch((err) => {
        res.status(500).send({ message: "error", error: err.message });
    });
};
exports.getStore = getStore;
const getStores = async (req, res) => {
    let page = req.query.page;
    // Check if page is a valid number
    if (page) {
        const { error } = coupon_1.numberSchema.validate(Number(page));
        if (error) {
            res.status(422).json({
                status: "error",
                message: "You must enter a valid page number",
                data: error.message,
            });
        }
    }
    //Calculate pagination start item
    let pageStart = Number(page) * 10 - 10;
    let repository = typeorm_1.getRepository(Store_1.Stores);
    try {
        let allStores = await repository.find();
        // If a page wasn't provided, send all the stores
        if (!page) {
            let response = {
                stores_total: allStores.length,
                allStores,
            };
            return res.send(response);
        }
        // If a page was provided, send correspondent stores with pagination
        let paginateStores = await repository.find({
            skip: pageStart,
            take: 10,
        });
        let response = { stores_total: allStores.length, paginateStores };
        res.send(response);
    }
    catch (err) {
        res.status(500).send({ message: "error", error: err.message });
    }
};
exports.getStores = getStores;
const createStore = async (req, res) => {
    let name = req.query.name;
    let address = req.query.address;
    // Check if name and address were provided
    if (!name) {
        return res.status(422).send({
            status: "error",
            message: "Please enter a valid name",
        });
    }
    if (!address) {
        return res.status(422).send({
            status: "error",
            message: "Please enter a valid address",
        });
    }
    let repository = typeorm_1.getRepository(Store_1.Stores);
    // Create a new store
    let newStore = new Store_1.Stores();
    newStore.name = name;
    newStore.address = address;
    // Save the  store  to the database
    repository
        .save(newStore)
        .then((data) => {
        res.sendStatus(201);
    })
        .catch((err) => {
        res.send({ message: "error", error: err.message });
    });
};
exports.createStore = createStore;
const deleteStore = async (req, res) => {
    let id = req.query.id;
    // Check if ID is a number
    const { error } = coupon_1.numberSchema.validate(Number(id));
    if (error) {
        res.status(422).json({
            status: "error",
            message: "You must enter a valid ID",
            data: error.message,
        });
    }
    let repository = typeorm_1.getRepository(Store_1.Stores);
    // Find the store and delete if it exists. Otherwise, send an error message
    repository
        .findOne({ id: Number(id) })
        .then((store) => {
        if (!store) {
            return store;
        }
        else {
            return repository.remove(store);
        }
    })
        .then((data) => {
        if (!data) {
            return res.status(404).json({
                status: "error",
                message: "The provided ID doesn't exist in the database",
            });
        }
        else {
            res.status(201).send("Coupon with ID " + id + " has been removed");
        }
    })
        .catch((err) => {
        res.send({ message: "error", error: err.message });
    });
};
exports.deleteStore = deleteStore;
