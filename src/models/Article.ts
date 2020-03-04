import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

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

  @Column({ nullable: false })
  postedBy: string;

  @Column({
    type: "enum",
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT
  })
  status: ArticleStatus;

  // timestamps!
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: Date;

  @OneToMany(
    type => Rating,
    rating => rating.article
  )
  ratings: Rating[];
}
