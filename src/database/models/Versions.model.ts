import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

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

  @Column()
  importedDate!: number

  @Column()
  winSha!: string

  @Column()
  linuxSha!: string

  @Column()
  macSha!: string

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date
}
