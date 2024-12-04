import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("news")
export class News {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  version?: string

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
