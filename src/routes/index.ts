import express from 'express';
import authRoutes from './auth.routes.js';

export const initRouter = (app: express.Application, prefix = '/api') => {
  app.use(`${prefix}/`, authRoutes);
};
