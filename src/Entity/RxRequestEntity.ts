import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import RxRequestLineItemEntity from "./RxRequestLineItemEntity";
@Entity("rx_request", { schema: "smartscripts_pom" })
class RxRequestEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id?: number;

  @Column("varchar", {
    name: "rx_request_id",
    nullable: false,
    unique: true,
    length: 36,
  })
  rxRequestId!: string;

  @Column("varchar", { name: "parent_request_id", nullable: true, length: 36 })
  parentRequestId?: string;

  @Column("varchar", { name: "patient_id", nullable: false, length: 36 })
  patientId!: string;

  @Column("varchar", {
    name: "partner_fulfilling_pharmacy_id",
  })
  partnerFulfillingPharmacy!: string;

  @Column("varchar", { name: "needs_by_date", nullable: false })
  needsByDate!: string;

  @Column("varchar", { name: "patient_name", nullable: true })
  patientName!: string;

  @Column("varchar", { name: "partner_name", nullable: true })
  partnerName!: string;

  @Column("varchar", { name: "status", nullable: false })
  status!: string;

  @Column("jsonb", { nullable: false, name: "meta_data" })
  metaData!: Record<string, any>;

  @CreateDateColumn({ name: "created_timestamp", nullable: false })
  createdTimestamp?: Date;

  @UpdateDateColumn({ name: "modified_timestamp", nullable: false })
  modifiedTimestamp?: Date;

  @OneToMany(() => RxRequestLineItemEntity, (lineItem) => lineItem.request, {eager: true})
  requestLineItems!: RxRequestLineItemEntity[];
}

export default RxRequestEntity;
