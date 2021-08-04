import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Coupons {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "char", length: 8 })
  code: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  expires_at: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  assigned_at: string;

  @Column({ type: "varchar", length: 100 })
  customer_email: string;
}
