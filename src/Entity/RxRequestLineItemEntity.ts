/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/indent */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import RxRequestEntity from "./RxRequestEntity";
@Entity("rx_request_line_item", { schema: "smartscripts_pom" })
class RxRequestLineItemEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id?: number;

  @Column("varchar", {
    name: "request_line_item_id",
    nullable: false,
    length: 36,
    unique: true,
  })
  requestLineItemId!: string;

  @Column("varchar", { name: "rx_request_id" })
  request!: RxRequestEntity;

  @Column("varchar", { name: "line_item_type", nullable: false, length: 36 })
  lineItemType!: string;

  @Column("varchar", { nullable: false, name: "status" })
  status!: string;

  @Column("boolean", {
    nullable: false,
    name: "tagged_for_review",
    default: false,
  })
  taggedForReview?: boolean;

  @Column("int", { nullable: true, name: "qs1_rx_number" })
  qs1RxNumber?: string;

  @Column("int", { nullable: true, name: "copay" })
  copay?: number;

  @Column("jsonb", { nullable: false, name: "line_item" })
  lineItem!: Record<string, any>;

  @Column("varchar", { name: "needs_by_date", nullable: false })
  needsByDate!: string;

  @Column({ name: "pom_prescription_id", nullable: false })
  pomPrescriptionId?: string;

  @CreateDateColumn({ name: "created_timestamp", nullable: false })
  createdTimestamp?: Date;

  @UpdateDateColumn({ name: "modified_timestamp", nullable: false })
  modifiedTimestamp?: Date;

  @Column("varchar", { name: "estimated_fulfillment_date", nullable: true })
  estimatedFulfillmentDate?: string;

  @Column("varchar", { name: "rx_order_id", nullable: true, length: 12 })
  orderId?: string;
}

export default RxRequestLineItemEntity;
