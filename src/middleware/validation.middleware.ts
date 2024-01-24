import { NextFunction, Request, RequestHandler, Response } from 'express';
import Joi, { ValidationError } from 'joi';

export default function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            req.body = await schema.validateAsync(req.body, {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true,
            });
            next();
        } catch (validationError) {
            const errors = (validationError as ValidationError).details.map(
                (error: Joi.ValidationErrorItem) => error.message,
            );
            res.status(400).send({ errors });
        }
    };
}
