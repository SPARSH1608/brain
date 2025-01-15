import express from 'express';
import config from './config/server.config';
import { connectDB } from './config/db';
import ApiRoutes from './routes/index';
import cors from 'cors';
import { uploadRouter } from './uploadthing';
import { createRouteHandler } from 'uploadthing/express';
import { createUploadthing } from 'uploadthing/server';

const app = express();
// app.use(
//   cors({
//     credentials: true,
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders:
//       'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
//   })
// );
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Uploadthing
const f = createUploadthing();

const uploadthingConfig = {
  config: {
    uploadMiddleware: uploadRouter,
    callbackUrl: '/api/uploadthing',
    // Add any other required configuration options
  },
};
app.use('/api/v1', ApiRoutes);

const startServer = async () => {
  app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
  });
  connectDB(config.MONGO_URI!);
};

startServer();
