import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TasksStatus } from './task.model';
import { User } from '../auth/user.entity';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TasksStatus;

  @ManyToOne(type => User, user => user.tasks, { eager: false })
  user: User

  @Column()
  userId: number
}
