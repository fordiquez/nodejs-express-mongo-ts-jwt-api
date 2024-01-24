import jwt from 'jsonwebtoken';
import User from '../modules/user/user.interface.js';
import Token from '../utils/interfaces/token.interface.js';
import AuthenticatedRequest from './interfaces/authenticated.request.interface.js';
import validateEnv from './validateEnv.js';

export const createToken = (user: User, options: jwt.SignOptions = { expiresIn: '1d' }): string => {
    return jwt.sign({ id: user._id }, validateEnv().JWT_SECRET as jwt.Secret, options);
};

export const verifyToken = async (
    token: string,
    options?: jwt.VerifyOptions | undefined,
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, validateEnv().JWT_SECRET as jwt.Secret, options, (err, payload) => {
            if (err) return reject(err);

            resolve(payload as Token);
        });
    });
};

export const getToken = (req: AuthenticatedRequest): string | undefined => {
    const { AUTH_FLOW } = validateEnv();

    return AUTH_FLOW === 'bearer'
        ? req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split('Bearer ')[1].trim()
        : req.cookies.token;
};

export default { createToken, verifyToken, getToken };
