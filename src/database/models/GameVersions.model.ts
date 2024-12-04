import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm"

@Entity("game_versions")
export class GameVersions {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  version!: string

  @Column({ nullable: true })
  windows?: string

  @Column({ nullable: true })
  linux?: string

  @Column({ nullable: true })
  macos?: string

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date
}
