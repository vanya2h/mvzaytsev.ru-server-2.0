
/**
 * @swagger
 * definitions:
 *  MongooseModel:
 *   type: object
 *   properties:
 *    _id:
 *     type: string
 *     required: true
 *    createdAt:
 *     type: string
 *     format: "date-time"
 *     required: true
 *    updatedAt:
 *     type: string
 *     format: "date-time"
 *     required: true
 *    __v:
 *     type: number
 *     required: true
 */

export interface IMongooseModel {
	_id: string;
	createdAt: string;
	updatedAt: string;
	__v: number
}
