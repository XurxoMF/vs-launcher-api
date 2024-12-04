import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("changelogs")
export class Changelogs {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  version!: string

  @Column()
  md!: string

  @Column()
  author!: string

  @Column()
  title!: string

  @Column()
  date!: string

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date
}
