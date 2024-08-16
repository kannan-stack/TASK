/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/indent */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
// import { PrescriptionData } from "../../types/PrescriptionEligibility";

@Entity("prescription", { schema: "smartscripts_pom" })
class PrescriptionEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id?: number;

  @Column("varchar", {
    name: "pom_prescription_id",
    nullable: false,
    unique: true,
    length: 36,
  })
  pomPrescriptionId!: string;

  @Column("varchar", { name: "patient_id", nullable: false, length: 36 })
  patientId!: string;

  @Column("varchar", { name: "qs1_rx_number", nullable: false })
  qs1RxNumber!: string;

  @Column("jsonb", { name: "prescriptiondata", nullable: false })
  prescriptionData!: string;

  @Column("timestamp", { name: "last_refreshed", nullable: false })
  lastRefreshed!: Date;

  @CreateDateColumn({ name: "created_timestamp", nullable: false })
  createdTimestamp?: Date;

  @UpdateDateColumn({ name: "modified_timestamp", nullable: false })
  modifiedTimestamp?: Date;

  @Column("boolean", { name: "is_active", nullable: false, default: true })
  isActive?: boolean;

  @Column("boolean", { name: "autofill", nullable: false, default: false })
  autofill?: boolean;

  @Column("boolean", { name: "is_expired", nullable: false, default: false })
  isExpired?: boolean;
}

export default PrescriptionEntity;
