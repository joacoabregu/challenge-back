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

export const getStores = async (req: Request, res: Response) => {
  let page = req.query.page as string;
  let pageStart: number = Number(page) * 10 - 10;
  let repository = getRepository(Stores);
  let allStores = await repository.find();
  if (!page) {
    let response = {
      stores_total: allStores.length,
      allStores,
    };
    return res.send(response);
  }

  repository
    .find({
      skip: pageStart,
      take: 10,
    })
    .then((stores) => {
      let response = { stores_total: allStores.length, paginateStores: stores };
      res.send(response);
    })
    .catch((err) => {
      res.send({ message: "error", error: err.message });
    });
};
