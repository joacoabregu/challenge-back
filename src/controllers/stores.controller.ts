import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Stores } from "../entity/Store";
import { numberSchema } from "../validators/coupon";

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
        res.status(404).send({
          status: "error",
          message: "The provided name doesn't exist in the database",
        });
      } else {
        res.send(store);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "error", error: err.message });
    });
};

export const getStores = async (req: Request, res: Response) => {
  let page = req.query.page as string;

  if (page) {
    const { error } = numberSchema.validate(Number(page));

    if (error) {
      res.status(422).json({
        status: "error",
        message: "You must enter a valid page number",
        data: error.message,
      });
    }
  }

  let pageStart: number = Number(page) * 10 - 10;
  let repository = getRepository(Stores);

  try {
    let allStores = await repository.find();
    if (!page) {
      let response = {
        stores_total: allStores.length,
        allStores,
      };
      return res.send(response);
    }
    let paginateStores = await repository.find({
      skip: pageStart,
      take: 10,
    });
    let response = { stores_total: allStores.length, paginateStores };
    res.send(response);
  } catch (err) {
    res.status(500).send({ message: "error", error: err.message });
  }
};

export const createStore = async (req: Request, res: Response) => {
  let name = req.query.name as string;
  let address = req.query.address as string;

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
  const { error } = numberSchema.validate(Number(id));

  if (error) {
    res.status(422).json({
      status: "error",
      message: "You must enter a valid ID",
      data: error.message,
    });
  }
  let repository = getRepository(Stores);

  repository
    .findOne({ id: Number(id) })
    .then((store) => {
      if (!store) {
        return store;
      } else {
        return repository.remove(store);
      }
    })
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          status: "error",
          message: "The provided ID doesn't exist in the database",
        });
      } else {
        res.status(201).send("Coupon with ID " + id + " has been removed");
      }
    })
    .catch((err) => {
      res.send({ message: "error", error: err.message });
    });
};
