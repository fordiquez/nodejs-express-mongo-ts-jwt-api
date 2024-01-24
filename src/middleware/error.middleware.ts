import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/http.exception.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorMiddleware(error: HttpException, _req: Request, res: Response, _next: NextFunction): void {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';

    res.status(status).send({ status, message });
}
