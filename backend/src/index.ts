import express from 'express';
import config from './config/server.config';
import { connectDB } from './config/db';
import ApiRoutes from './routes/index';
import cors from 'cors';

import path from 'path';
const app = express();
import fileUpload from 'express-fileupload';

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));
// __dirname = path.resolve();
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: path.join(__dirname, 'tmp'),
//     createParentPath: true,
//     limits: {
//       fileSize: 10 * 1024 * 1024,
//     },
//   })
// );
app.use('/api/v1', ApiRoutes);

const startServer = async () => {
  app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
  });
  connectDB(config.MONGO_URI!);
};

startServer();
