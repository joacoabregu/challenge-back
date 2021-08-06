import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Stores } from "../entity/Store";
import { storeIdSchema } from "../validators/coupon";

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

export const createStore = async (req: Request, res: Response) => {
  let name = req.query.name as string;
  let address = req.query.address as string;

  if (!name) {
    return res.status(422).json({
      status: "error",
      message: "Ingrese un nombre válido",
    });
  }
  if (!address) {
    return res.status(422).json({
      status: "error",
      message: "Ingrese una dirección válida",
    });
  }
  let repository = getRepository(Stores);
  let newStore = new Stores();

  newStore.name = name;
  newStore.address = address;
  repository
    .save(newStore)
    .then((data) => {
      res.sendStatus(201);
    })
    .catch((err) => {
      res.send({ message: "error", error: err.message });
    });
};

export const deleteStore = async (req: Request, res: Response) => {
  let id = req.query.id as string;
  const { error } = storeIdSchema.validate(Number(id));

  if (error) {
    res.status(422).json({
      status: "error",
      message: "Debe ingresar un ID válido",
      data: error.message,
    });
  }
  let repository = getRepository(Stores);

  let store = await repository.findOne({ id: Number(id) });

  if (!store) {
    return res.status(404).json({
      status: "error",
      message: "El ID ingresado no existe en la base de datos.",
    });
  }
  repository
    .remove(store)
    .then(() => {
      res.status(201).send("Se ha eliminado el cupón con el ID " + id);
    })
    .catch((err) => {
      res.send({ message: "error", error: err.message });
    });
};
