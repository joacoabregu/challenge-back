import { Request, Response } from "express";
import Joi from "joi";
import { getRepository } from "typeorm";
import { Coupons } from "../entity/Coupons";
import { codeSchema, emailSchema } from "../validators/coupon";

export const getCoupons = async (req: Request, res: Response) => {
  let code = req.query.code as string;
  let email = req.query.email as string;

  let repository = getRepository(Coupons);

  repository
    .find({ code })
    .then((data: Coupons[]) => {
      let coupon: Coupons = data[0];
      if (coupon.customer_email === email) {
        res.sendStatus(200);
      } else {
        res.status(404).send("El cupón no pertenece al email ingresado");
      }
    })
    .catch((err) => {
      res.send({ message: "error", error: err.message });
    });
};

export const createCoupon = async (req: Request, res: Response) => {
  let code = req.query.code as string;

  const { error } = codeSchema.validate(code);

  if (error) {
    res.status(422).json({
      status: "error",
      message: "Invalid Code",
      data: error.message,
    });
  }

  let repository = getRepository(Coupons);
  let coupon = new Coupons();
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

export const updateCoupon = async (req: Request, res: Response) => {
  let email = req.query.email as string;

  const { error } = emailSchema.validate(email);

  if (error) {
    res.status(422).json({
      status: "error",
      message: "Invalid email",
      data: error.message,
    });
  }
  let repository = getRepository(Coupons);

  repository
    .findOne(email)
    .then(() => {
      res.status(422).json({
        status: "error",
        message: "Este email ya ha generado un cupón",
      });
    })
    .catch((err) => {
      res.send({ message: "error", error: err.message });
    });
};
