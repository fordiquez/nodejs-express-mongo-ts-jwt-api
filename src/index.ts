import 'dotenv/config';
import validateEnv from './utils/validateEnv.js';
import App from './app.js';
import UserController from './modules/user/user.controller.js';

const env = validateEnv();

const app = new App([new UserController()], Number(env.PORT), env.WHITELISTED_DOMAINS, env.MONGO_URL);

app.listen();
