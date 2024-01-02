/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../../users/src/schemas/user.schema';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  priority: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ default: false })
  isComplete: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
