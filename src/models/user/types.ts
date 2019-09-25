import { Document } from 'mongoose';

export enum UserRole {
	Teacher = 'Teacher',
	Parent = 'Parent',
	Student = 'Student'
}

export interface IUser extends Document {
	comparePassword: (this: IUser, candidate: string) => Promise<boolean>;
	email: string;
	name: string;
	role: UserRole,
	password: string;
}
