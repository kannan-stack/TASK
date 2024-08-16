

/* eslint-disable @typescript-eslint/indent */
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import RxRequestEntity from "./RxRequestEntity";
// import { OrderStatus, RxOrderMetadata } from '../../types/order';

@Entity("rx_order", { schema: "smartscripts_pom" })
class RxOrderEntity {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id?: number;

  @Column("varchar", {
    name: "order_id",
    nullable: false,
    unique: true,
    length: 12,
  })
  orderId!: string;

  @ManyToOne(() => RxRequestEntity, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "rx_request_id", referencedColumnName: "rxRequestId" })
  request!: RxRequestEntity;

  @Column("varchar", { name: "status", nullable: false })
  status!:string;

  @Column("bool", {
    name: "processed_external",
    nullable: false,
    default: false,
  })
  processedExternal!: boolean;

  @Column("jsonb", { nullable: true, name: "metadata" })
  metadata?: string;

  @Column("varchar", { name: "order_shipment_id", nullable: true, length: 36 })
  orderShipmentId?: string;

  @CreateDateColumn({ name: "created_timestamp", nullable: false })
  createdTimestamp?: Date;

  @UpdateDateColumn({ name: "modified_timestamp", nullable: false })
  modifiedTimestamp?: Date;
}

export default RxOrderEntity;