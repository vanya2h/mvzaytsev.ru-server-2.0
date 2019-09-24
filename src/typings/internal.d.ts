declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string,
    MONGO_USER: string,
    MONGO_PASSWORD: string,
    MONGO_HOST: string,
    MONGO_DATABASE: string,
  }
}
