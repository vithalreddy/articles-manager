import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Rating } from "./Rating";

export enum ArticleStatus {
  DRAFT = "draft",
  UNDER_REVIEW = "under_review",
  REVIEWED = "reviewed",
  PUBLISHED = "published"
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 250,
    unique: true,
    nullable: false
  })
  title: string;

  @Column("text", {
    nullable: false
  })
  description: string;

  @Column({ nullable: false })
  image: string;

  @Column({
    type: "enum",
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT
  })
  status: ArticleStatus;

  // timestamps!
  @Column("timestamp", {
    precision: 3,
    default: () => "CURRENT_TIMESTAMP(3)"
  })
  createdAt: Date;

  @Column("timestamp", {
    precision: 3,
    default: () => "CURRENT_TIMESTAMP(3)",
    onUpdate: "CURRENT_TIMESTAMP(3)"
  })
  updateAt: Date;

  @OneToMany(
    type => Comment,
    comment => comment.article
  )
  ratings: Rating[];
}
