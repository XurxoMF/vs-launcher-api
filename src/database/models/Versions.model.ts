import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm"

@Entity("versions")
export class Versions {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  version!: string

  @Column()
  type!: string

  @Column()
  releaseDate!: number

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date
}
