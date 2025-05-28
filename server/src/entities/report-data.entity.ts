import { Column, Entity } from "typeorm";
import { UserBaseEntity } from "../common/entities/user-base-entity";

@Entity("report_data")
export class ReportDataEntity extends UserBaseEntity {
  @Column({ nullable: true })
  totalPurchased: number;

  @Column({ nullable: true })
  totalWaste: number;

  @Column({ nullable: true })
  consumptionTrends: number;
}
