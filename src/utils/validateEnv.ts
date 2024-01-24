import { cleanEnv, str, port, makeValidator, num } from 'envalid';

const array = makeValidator((string: string): string[] => string.split(','));

export default function validateEnv() {
    return cleanEnv(process.env, {
        NODE_ENV: str({ choices: ['local', 'development', 'production'] }),
        MONGO_URI: str(),
        PORT: port({ default: 3000 }),
        JWT_SECRET: str(),
        WHITELISTED_DOMAINS: array(),
        AUTH_FLOW: str({ choices: ['bearer', 'cookie'] }),
        MAIL_HOST: str(),
        MAIL_PORT: num(),
        MAIL_USERNAME: str(),
        MAIL_PASSWORD: str(),
        MAIL_FROM_ADDRESS: str(),
    });
}
