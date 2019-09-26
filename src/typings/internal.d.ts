declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string,
    MONGO_USER: string,
    MONGO_PASSWORD: string,
    MONGO_HOST: string,
		MONGO_DATABASE: string,
		SECRET: string,
		PORT: string,
		EMAIL_ACTOR: string,
		EMAIL_ACTOR_NAME: string,
		PREFIX: string,
		SENDGRID_API_KEY: string,
  }
}
