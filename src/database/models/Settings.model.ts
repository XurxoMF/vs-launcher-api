import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("settings")
export class Settings {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  key!: string

  @Column()
  value!: string

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date
}
