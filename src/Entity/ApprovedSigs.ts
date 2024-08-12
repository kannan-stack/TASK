/* eslint-disable @typescript-eslint/indent */
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity('approved_sigs', { schema: "pe_lookups" })
  class ApprovedSigs {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: 'uuid', name: 'sig_id', nullable: false })
    sigId!: string;
  
    @Column({ type: 'varchar', name: 'sig', nullable: false })
    sig!: string;
  
    @CreateDateColumn({ name: 'created_timestamp', nullable: false })
    createdTimestamp?: Date;
  
    @UpdateDateColumn({ name: 'modified_timestamp', nullable: false })
    modifiedTimestamp?: Date;
  
    @Column({ type: 'boolean', name: 'is_active', nullable: false, default: true })
    isActive!: boolean;
  }
  
  export default ApprovedSigs;
  