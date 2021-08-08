import { NextFunction, Request, Response } from "express";
import { getRepository, IsNull } from "typeorm";
import { Coupons } from "../entity/Coupons";
import { codeSchema, emailSchema, numberSchema } from "../validators/coupon";

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
      message: "You must enter a code",
    });
  }

  let { error } = codeSchema.validate(code);

  if (error) {
    res.status(422).json({
      status: "error",
      message: "Invalid code",
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
      message: "You must enter an email",
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
          message: "This email has already generated a coupon",
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
      let date = new Date();
      couponToUpdate.assigned_at = date.toISOString();
      let couponUpdated = await repository.save(couponToUpdate);
      res.send(
        "The email " +
          couponUpdated.customer_email +
          " has been assigned correctly to the coupon " +
          couponUpdated.code
      );
    } else {
      res.status(200).send({ message: "No coupons available" });
    }
  } catch (err) {
    res.send({ message: "error", error: err.message });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  let id = req.query.id as string;
  const { error } = numberSchema.validate(Number(id));

  if (error) {
    res.status(422).json({
      status: "error",
      message: "You must enter a valid ID",
      data: error.message,
    });
  }
  let repository = getRepository(Coupons);

  try {
    let coupon = await repository.findOne({ id: Number(id) });
    if (!coupon) {
      return res.status(404).json({
        status: "error",
        message: "The provided ID doesn't exist in the database.",
      });
    }
    if (coupon.customer_email) {
      return res.status(404).json({
        status: "error",
        message:
          "The provided coupon can't be deleted. It has already been assigned.",
      });
    } else {
      repository.remove(coupon).then(() => {
        res.status(201).send("Coupon with ID " + id + " has been removed");
      });
    }
  } catch (err) {
    res.send({ message: "error", error: err.message });
  }
};
