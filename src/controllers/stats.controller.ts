import { getRepository } from "typeorm";
import { Coupons } from "../entity/Coupons";
import { Request, Response } from "express";

export const getStats = async (req: Request, res: Response) => {
  let repository = getRepository(Coupons);
  try {
    // Find all stores in the database
    let coupons = await repository.find();
    // Filter coupons that has been assigned
    let assignedCoupons = coupons.filter((coupon) => {
      return coupon.assigned_at !== null;
    });
    // Calculate coupons that hasn't been assigned
    let notAssignedCoupons = coupons.length - assignedCoupons.length;

    // Find all the dates from "assigned_at" column that are unique
    let couponsAssignedByDay = await repository
      .createQueryBuilder("coupons")
      .select("DATE(assigned_at)")
      .distinct(true)
      .getRawMany();
    // Find all the dates from "created_at" column that are unique
    let couponsCreatedByDay = await repository
      .createQueryBuilder("coupons")
      .select("DATE(created_at)")
      .distinct(true)
      .getRawMany();

    let Stats = {
      coupons_total: coupons.length,
      assigned_coupons_total: assignedCoupons.length,
      not_assigned_coupons_total: notAssignedCoupons,
      assigned_by_day_total: couponsAssignedByDay.length - 1,
      created_by_day_total: couponsCreatedByDay.length,
    };

    res.send(Stats);
  } catch (err) {
    res.send({ message: "error", error: err.message });
  }
};
