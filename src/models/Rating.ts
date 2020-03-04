import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

import { IsInt, Min, Max } from "class-validator";

import { Article } from "./Article";

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @Column({ nullable: true })
  comment: string;

  @Column()
  commentedBy: string;

  // timestamps!
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updateAt: Date;

  @ManyToOne(
    type => Article,
    article => article.ratings,
    { onDelete: "CASCADE" }
  )
  article: Article;
}
