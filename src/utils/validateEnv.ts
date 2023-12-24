import { cleanEnv, str, port, makeValidator } from 'envalid';

const array = makeValidator((string: string): string[] => string.split(','));

export default function validateEnv() {
  return cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['local', 'development', 'production'],
    }),
    MONGO_URL: str(),
    PORT: port({ default: 3000 }),
    JWT_SECRET: str(),
    WHITELISTED_DOMAINS: array(),
  });
}
