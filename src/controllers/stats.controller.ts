import { getRepository } from "typeorm";
import { Coupons } from "../entity/Coupons";
import { Request, Response } from "express";

export const getStats = async (req: Request, res: Response) => {
  let repository = getRepository(Coupons);
  try {
    let coupons = await repository.find();
    let assignedCoupons = coupons.filter((coupon) => {
      return coupon.assigned_at !== null;
    });
    let notAssignedCoupons = coupons.length - assignedCoupons.length;

    let couponsAssignedByDay = await repository
      .createQueryBuilder("coupons")
      .select("DATE(assigned_at)")
      .distinct(true)
      .getRawMany();

    let couponsExpiresByDay = await repository
      .createQueryBuilder("coupons")
      .select("DATE(expires_at)")
      .distinct(true)
      .getRawMany();

    let Stats = {
      coupons_total: coupons.length,
      assigned_coupons_total: assignedCoupons.length,
      not_assigned_coupons_total: notAssignedCoupons,
      assigned_by_day_total: couponsAssignedByDay.length - 1,
      expires_by_day_total: couponsExpiresByDay.length,
    };

    res.send(Stats);
  } catch (err) {
    res.send({ message: "error", error: err.message });
  }
};
