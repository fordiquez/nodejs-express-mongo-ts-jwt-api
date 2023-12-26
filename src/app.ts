import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import ErrorMiddleware from './middleware/error.middleware.js';
import logger from './utils/logger.js';
import Controller from './utils/interfaces/controller.interface.js';

export default class App {
  public express: Application;
  public port: number;
  public whiteList: string[];
  public mongoURL: string;

  constructor(controllers: Controller[], port: number, whiteList: string[], mongoURL: string) {
    this.express = express();
    this.port = port;
    this.whiteList = whiteList;
    this.mongoURL = mongoURL;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.initializeDatabaseConnection()
      .then(() => logger.info('Connected to MongoDB successfully'))
      .catch((error) => {
        logger.error(error);
        process.exit(1);
      });
  }

  private initializeMiddlewares(): void {
    this.express.use(helmet());
    this.express.use(
      cors({
        origin: (origin, callback) =>
          !origin || this.whiteList.indexOf(origin) !== -1 ? callback(null, true) : callback(null, false),
        credentials: true,
        optionsSuccessStatus: 200,
      }),
    );
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
    this.express.use(cookieParser());
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private async initializeDatabaseConnection(): Promise<typeof mongoose> | never {
    return this.mongoURL ? await mongoose.connect(this.mongoURL) : process.exit(1);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      logger.info(`App listening on the port: ${this.port}`);
    });
  }
}
