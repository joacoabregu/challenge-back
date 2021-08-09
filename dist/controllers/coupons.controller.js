"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.validateEmailCoupon = exports.createCoupon = exports.getCoupons = void 0;
const typeorm_1 = require("typeorm");
const Coupons_1 = require("../entity/Coupons");
const coupon_1 = require("../validators/coupon");
const getCoupons = async (req, res) => {
    let code = req.query.code;
    let email = req.query.email;
    let repository = typeorm_1.getRepository(Coupons_1.Coupons);
    if (!code && !email) {
        repository
            .find()
            .then((coupons) => {
            res.send(coupons);
        })
            .catch((err) => {
            res.send({ message: "error", error: err.message });
        });
    }
    if (!code) {
        res.status(422).json({
            status: "error",
            message: "You must enter a code",
        });
    }
    if (!email) {
        res.status(422).json({
            status: "error",
            message: "You must enter an email",
        });
    }
    repository
        .find({ code })
        .then((data) => {
        let coupon = data[0];
        if (coupon.customer_email === email) {
            res.sendStatus(200);
        }
        else {
            res.status(404).send("The coupon doesn't belong to the provided email");
        }
    })
        .catch((err) => {
        res.send({ message: "error", error: err.message });
    });
};
exports.getCoupons = getCoupons;
const createCoupon = async (req, res) => {
    let code = req.query.code;
    // Check if a code was passed
    if (!code) {
        res.status(422).json({
            status: "error",
            message: "You must enter a code",
        });
    }
    //Check if the code is valid
    let { error } = coupon_1.codeSchema.validate(code);
    if (error) {
        res.status(422).json({
            status: "error",
            message: "Invalid code",
            data: error.message,
        });
    }
    //Create new coupon and store it in the database
    let repository = typeorm_1.getRepository(Coupons_1.Coupons);
    let coupon = new Coupons_1.Coupons();
    coupon.code = code;
    repository
        .save(coupon)
        .then(() => {
        res.sendStatus(201);
    })
        .catch((err) => {
        res.send({ message: "error", error: err.message });
    });
};
exports.createCoupon = createCoupon;
const validateEmailCoupon = async (req, res, next) => {
    let email = req.query.email;
    // Check if an email was passed
    if (!email) {
        res.status(422).json({
            status: "error",
            message: "You must enter an email",
        });
    }
    //Check if the email is valid
    const { error } = coupon_1.emailSchema.validate(email);
    if (error) {
        res.status(422).json({
            status: "error",
            message: "Invalid email",
            data: error.message,
        });
    }
    // Check if the email has already generated a coupon. If not pass to next middleware.
    let repository = typeorm_1.getRepository(Coupons_1.Coupons);
    repository
        .findOne({ customer_email: email })
        .then((data) => {
        if (data) {
            res.status(422).json({
                status: "error",
                message: "This email has already generated a coupon",
            });
        }
        else {
            next();
        }
    })
        .catch((err) => {
        res.send({ message: "error", error: err.message });
    });
};
exports.validateEmailCoupon = validateEmailCoupon;
const updateCoupon = async (req, res) => {
    let email = req.query.email;
    let repository = typeorm_1.getRepository(Coupons_1.Coupons);
    try {
        // Find a cupon that hasn't already been assigned
        let couponToUpdate = await repository.findOne({
            where: {
                customer_email: typeorm_1.IsNull(),
            },
        });
        // If there is a coupon, update it. Otherwise, send a message.
        if (couponToUpdate) {
            couponToUpdate.customer_email = email;
            let date = new Date();
            couponToUpdate.assigned_at = date.toISOString();
            let couponUpdated = await repository.save(couponToUpdate);
            res.send("The email " +
                couponUpdated.customer_email +
                " has been assigned correctly to the coupon " +
                couponUpdated.code);
        }
        else {
            res.status(200).send({ message: "No coupons available" });
        }
    }
    catch (err) {
        res.send({ message: "error", error: err.message });
    }
};
exports.updateCoupon = updateCoupon;
const deleteCoupon = async (req, res) => {
    let id = req.query.id;
    // Check if an id was passed
    if (!id) {
        res.status(422).json({
            status: "error",
            message: "You must enter an ID",
        });
    }
    //Check if the id is a number
    const { error } = coupon_1.numberSchema.validate(Number(id));
    if (error) {
        res.status(422).json({
            status: "error",
            message: "You must enter a valid ID",
            data: error.message,
        });
    }
    let repository = typeorm_1.getRepository(Coupons_1.Coupons);
    try {
        // Find the coupon. If it doesn't exist send a message
        let coupon = await repository.findOne({ id: Number(id) });
        if (!coupon) {
            return res.status(404).json({
                status: "error",
                message: "The provided ID doesn't exist in the database.",
            });
        }
        // If it has already been assigned, send a message. Otherwise, delete it from the database.
        if (coupon.customer_email) {
            return res.status(404).json({
                status: "error",
                message: "The provided coupon can't be deleted. It has already been assigned.",
            });
        }
        else {
            repository.remove(coupon).then(() => {
                res.status(201).send("Coupon with ID " + id + " has been removed");
            });
        }
    }
    catch (err) {
        res.send({ message: "error", error: err.message });
    }
};
exports.deleteCoupon = deleteCoupon;
