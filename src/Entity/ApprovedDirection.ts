56;
/* eslint-disable @typescript-eslint/indent */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("approved_direction", { schema: "pe_lookups" })
class ApprovedDirection {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "uuid", name: "sig_id", nullable: false })
  sigId!: string;

  @Column({ type: "varchar", name: "direction", nullable: false })
  direction!: string;

  @Column({ type: "varchar", name: "hashed_direction", nullable: false })
  hashedDirection!: string;

  @CreateDateColumn({ name: "created_timestamp", nullable: false })
  createdTimestamp?: Date;

  @UpdateDateColumn({ name: "modified_timestamp", nullable: false })
  modifiedTimestamp?: Date;

  @Column({ type: "boolean", name: "is_active", nullable: false })
  isActive!: boolean;
}

export default ApprovedDirection;
