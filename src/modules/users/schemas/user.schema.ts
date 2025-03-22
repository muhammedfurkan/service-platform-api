import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  PROVIDER = 'provider',
  CUSTOMER = 'customer',
  CLIENT = 'client'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned'
}

export enum LocationEnum {
  LOCATION1 = 'Location1',
  LOCATION2 = 'Location2',
  LOCATION3 = 'Location3'
}

export enum DocumentEnum {
  DOCUMENT1 = 'Document1',
  DOCUMENT2 = 'Document2',
  DOCUMENT3 = 'Document3'
}

@Schema({ timestamps: true, versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  confirmPassword: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, enum: UserRole })
  userType: UserRole;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  birthDate: string;

  @Prop({ required: false, enum: Object.values(UserStatus) })
  status: UserStatus;

  @Prop({ 
    type: [String], 
    required: false, 
    enum: Object.values(LocationEnum) 
  })
  selectedLocations: LocationEnum[];

  @Prop({ type: [String], required: false })
  selectedCategories: string[];

  @Prop({ 
    type: [String], 
    required: false, 
    enum: Object.values(DocumentEnum)
  })
  selectedDocuments: DocumentEnum[];

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ required: false })
  emailCode: string;

  @Prop({ required: false })
  emailCodeExpires: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;


  get id(): string {
    return this._id ? this._id.toString() : '';
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
      userType: this.userType,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      selectedLocations: this.selectedLocations,
      selectedCategories: this.selectedCategories,
      selectedDocuments: this.selectedDocuments
    };
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