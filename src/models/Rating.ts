import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

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

  @Column()
  comment: string;

  @Column()
  commentedBy: string;

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

  @ManyToOne(
    type => Article,
    article => article.ratings
  )
  article: Article;
}
