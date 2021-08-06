import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Coupons } from "../entity/Coupons";

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
      res.send({ message: "error" });
    });
};

export const createCoupon = async (req: Request, res: Response) => {
  let code = req.query.code as string;

}
