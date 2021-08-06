import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Stores {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 500 })
  address: string;
}
