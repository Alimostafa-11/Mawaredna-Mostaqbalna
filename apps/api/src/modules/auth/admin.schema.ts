import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

export type AdminRole = 'admin' | 'editor';

@Schema({ timestamps: true, collection: 'admins' })
export class Admin {
  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ type: String, required: true, select: false })
  passwordHash!: string;

  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({ type: String, enum: ['admin', 'editor'], default: 'editor' })
  role!: AdminRole;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;

  @Prop({ type: Date })
  lastLoginAt?: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
