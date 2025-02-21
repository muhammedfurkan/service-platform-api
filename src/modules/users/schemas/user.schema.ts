import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  PROVIDER = 'provider',
  CUSTOMER = 'customer'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop()
  phone?: string;

  @Prop()
  avatar?: string;

  @Prop({ type: Object })
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @Prop({ type: [String], default: [] })
  roles: string[];

  @Prop({ type: Date })
  lastLogin?: Date;

  @Prop({ type: Object })
  settings?: {
    notifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };

  get id(): string {
    return this._id ? this._id.toString() : '';
  }

  toJSON() {
    const obj = {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      role: this.role as UserRole,
      status: this.status,
      phone: this.phone,
      avatar: this.avatar,
      address: this.address,
      roles: this.roles,
      lastLogin: this.lastLogin,
      settings: this.settings,
    };
    return obj;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});