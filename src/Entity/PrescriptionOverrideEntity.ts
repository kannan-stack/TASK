/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/indent */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("prescription_override", { schema: "smartscripts_pom" })
class PrescriptionOverrideEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id?: number;

  @Column("varchar", {
    name: "prescription_uuid",
    nullable: false,
    unique: true,
    length: 36,
  })
  prescriptionUUID!: string;

  @Column("varchar", {
    name: "prescription_override_id",
    nullable: false,
    unique: true,
    length: 36,
  })
  prescriptionOverrideId!: string;

  @Column("varchar", {
    name: "patient_id",
    nullable: false,
    unique: true,
    length: 36,
  })
  patientId!: string;

  @Column("varchar", { name: "drug_name", nullable: false })
  drugName!: string;

  @Column("varchar", { name: "strength", nullable: true })
  strength?: string;

  @Column("varchar", { name: "unit", nullable: true })
  unit?: string;

  @Column("varchar", { name: "generic_drug_name", nullable: true })
  genericDrugName?: string;

  @Column("varchar", { name: "manufacturer", nullable: true })
  manufacturer?: string;

  @Column("varchar", { name: "ndc", nullable: true })
  ndc?: string;

  @Column("varchar", { name: "sig", nullable: false })
  sig!: string;

  @Column("varchar", { name: "prescriber_name", nullable: true })
  prescriberName?: string;

  @Column("varchar", { name: "form", nullable: true })
  form?: string;

  @Column("varchar", { name: "refills", nullable: true })
  refills?: string;

  @Column("varchar", { name: "quantity", nullable: true })
  quantity?: string;

  @CreateDateColumn({ name: "created_timestamp", nullable: false })
  createdTimestamp?: Date;

  @UpdateDateColumn({ name: "modified_timestamp", nullable: false })
  modifiedTimestamp?: Date;

  @Column("boolean", { name: "is_active", nullable: false, default: true })
  isActive?: boolean;
}

export default PrescriptionOverrideEntity;
