import { NextFunction, Request, Response } from "express";
import { getRepository, IsNull } from "typeorm";
import { Coupons } from "../entity/Coupons";
import { codeSchema, emailSchema, storeIdSchema } from "../validators/coupon";

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

  if (!code) {
    res.status(422).json({
      status: "error",
      message: "Debe ingresar un código",
    });
  }

  let { error } = codeSchema.validate(code);

  if (error) {
    res.status(422).json({
      status: "error",
      message: "Código inválido",
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

  if (!email) {
    res.status(422).json({
      status: "error",
      message: "Debe ingresar un email",
    });
  }

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

  try {
    let couponToUpdate = await repository.findOne({
      where: {
        customer_email: IsNull(),
      },
    });
    if (couponToUpdate) {
      couponToUpdate.customer_email = email;
      let couponUpdated = await repository.save(couponToUpdate);
      res.send(
        "Se ha asignado correctamente el email " +
          couponUpdated.customer_email +
          " al cupon " +
          couponUpdated.code
      );
    } else {
      res.status(200).send({ message: "No quedan cupones disponibles" });
    }
  } catch (err) {
    res.send({ message: "error", error: err.message });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  let id = req.query.id as string;
  const { error } = storeIdSchema.validate(Number(id));

  if (error) {
    res.status(422).json({
      status: "error",
      message: "Debe ingresar un ID válido",
      data: error.message,
    });
  }
  let repository = getRepository(Coupons);

  try {
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
        message:
          "El cupón ingresado no se puede eliminar. Ya ha sido asignado.",
      });
    } else {
      repository.remove(coupon).then(() => {
        res.status(201).send("Se ha eliminado el cupón con el ID " + id);
      });
    }
  } catch (err) {
    res.send({ message: "error", error: err.message });
  }
};
