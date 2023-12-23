import { Request, Response } from 'express';
import { registerUser } from '../services/auth.service.js';

export async function register(req: Request, res: Response) {
  const registered = await registerUser(req.body);

  if (!registered.user) {
    return res.status(400).send(registered);
  }

  req.login(registered.user, async (error) => {
    if (error) {
      return res.status(400).send(error);
    }

    return res.status(200).send({ message: registered.message, user: registered.user });
  });
}
