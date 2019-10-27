import { Document, Schema, Model } from 'mongoose';

/**
 * @swagger
 * definitions:
 *  User:
 *   allOf:
 *    - $ref: '#/definitions/MongooseModel'
 *    - type: object
 *      properties:
 *       email:
 *        type: string
 *        format: email
 *        required: true
 *       name:
 *        type: string
 *        required: true
 *       isAdmin:
 *        type: boolean
 *        required: true
 *       bio:
 *        type: string
 *        required: true
 *       password:
 *        type: string
 *        required: true
 */

export interface IUserDocument extends Document {
	email: Schema.Types.ObjectId;
	password: string;
	name: string;
	isAdmin: boolean;
	bio: string;
}

export interface IUser extends IUserDocument {
	comparePassword(candidate: string): Promise<boolean>;
}


export interface IUserModel extends Model<IUser> {
	findByEmail(email: string,): Promise<IUser>,
}
