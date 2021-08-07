import { getRepository } from "typeorm";
import { Coupons } from "../entity/Coupons";
import { Request, Response } from "express";

export const getStats = async (req: Request, res: Response) => {
  let repository = getRepository(Coupons);

  let coupons = await repository.find();
  let assignedCoupons = coupons.filter((coupon) => {
    return coupon.assigned_at !== null;
  });
  let notAssignedCoupons = coupons.length - assignedCoupons.length;

  let assignedByDay = await repository
    .createQueryBuilder("coupons")
    .select("DATE(assigned_at)")
    .distinct(true)
    .getRawMany();

  console.log(assignedByDay);

  let Stats = {
    coupons_total: coupons.length,
    assigned_coupons_total: assignedCoupons.length,
    not_assigned_coupons_total: notAssignedCoupons,
    assigned_by_day: assignedByDay.length - 1,
  };

  res.send(Stats);
};
