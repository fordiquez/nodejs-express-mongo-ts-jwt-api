import 'dotenv/config';
import validateEnv from './utils/validateEnv.js';
import App from './app.js';
import UserController from './modules/user/user.controller.js';

const { PORT, WHITELISTED_DOMAINS, MONGO_URL, AUTH_FLOW } = validateEnv();

const app = new App([new UserController(AUTH_FLOW)], PORT, WHITELISTED_DOMAINS, MONGO_URL);

app.listen();
