import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("versions")
export class Versions {
  @PrimaryGeneratedColumn()
  id!: number

  // "stable", "rc" or "pre"
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

  // Todo: deprecate and migrate database
  /** @deprecated superseded by {@link macX64Sha} */
  @Column()
  macSha?: string | null | undefined

  /** `string` if `version` >= 1.22.3 */
  @Column()
  macArm64Sha?: string | null | undefined

  /** `string` if `macSha` == (null|undefined) */
  @Column()
  macX64Sha?: string | null | undefined

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date
}
