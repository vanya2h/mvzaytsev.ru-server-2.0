export interface IConfig {
  mongoUser: string;
  mongoPassword: string;
	mongoHost: string;
	mongoDatabase: string,
	prefix: string,
	emailActor: string,
	emailActorName: string,
	port: number,
	secret: string
}
