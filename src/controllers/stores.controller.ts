import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Stores } from "../entity/Store";

export const getStore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let name = req.query.name as string;

  if (!name) {
    return next();
  }

  let repository = getRepository(Stores);

  repository
    .findOne({ name })
    .then((store) => {
      if (!store) {
        res.status(404).json({
          status: "error",
          message: "El nombre ingresado no existe en la base de datos.",
        });
      } else {
        res.send(store);
      }
    })
    .catch((err) => {
      res.send({ message: "error", error: err.message });
    });
};
