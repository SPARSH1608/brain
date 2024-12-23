import express from 'express';
import config from './config/server.config';
import { connectDB } from './config/db';
import ApiRoutes from './routes/index';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', ApiRoutes);

const startServer = async () => {
  app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
  });
  connectDB(config.MONGO_URI!);
};

startServer();
