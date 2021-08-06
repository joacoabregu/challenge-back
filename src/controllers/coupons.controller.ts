import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { EROFS } from "node:constants";
import { getRepository, IsNull } from "typeorm";
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

export const validateEmailCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    .findOne({ customer_email: email })
    .then((data) => {
      console.log(data);
      if (data) {
        res.status(422).json({
          status: "error",
          message: "Este email ya ha generado un cupón",
        });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.send({ message: "error", error: err.message });
    });
};

export const updateCoupon = async (req: Request, res: Response) => {
  let email = req.query.email as string;

  let repository = getRepository(Coupons);

  let couponToUpdate = await repository.findOne({
    where: {
      customer_email: IsNull(),
    },
  });

  if (couponToUpdate) {
    couponToUpdate.customer_email = email;
    repository
      .save(couponToUpdate)
      .then((data) => {
        res.send(
          "Se ha asignado correctamente el email " +
            data.customer_email +
            " al cupon " +
            data.code
        );
      })
      .catch((err) => {
        res.send({ message: "error", error: err.message });
      });
  } else {
    res.status(200).send({ message: "No quedan cupones disponibles" });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  let id = req.query.id as string;

  let repository = getRepository(Coupons);

  let coupon = await repository.findOne({ id: Number(id) });

  if (!coupon) {
    return res.status(404).json({
      status: "error",
      message: "El ID ingresado no existe en la base de datos.",
    });
  }
  if (coupon.customer_email) {
    return res.status(404).json({
      status: "error",
      message: "El cupón ingresado no se puede eliminar. Ya ha sido asignado.",
    });
  } else {
    repository
      .remove(coupon)
      .then((data) => {
        res.status(201).send("Se ha eliminado el cupón con el ID" + id);
      })
      .catch((err) => {
        res.send({ message: "error", error: err.message });
      });
  }
};
