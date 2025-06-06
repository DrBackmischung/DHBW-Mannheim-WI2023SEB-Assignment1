
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { setupLamp } from './lamp/setup.js';
import { startConsumer } from './messaging/consumer.js';
import { createRouter } from './api/routes.js';

dotenv.config();

const email = process.env.TP_EMAIL;
const password = process.env.TP_PASSWORD;
const deviceId = process.env.TP_DEVICE_ID;
const queueName = 'lamp-control';

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '..', 'public');

let device;

app.use('/api', createRouter(queueName));
app.use(express.static(publicPath));

app.listen(4000, async () => {
  console.log('Serving static files from:', publicPath);
  console.log('🚀 Server läuft auf http://localhost:4000');
  const result = await setupLamp(email, password, deviceId);
  device = result.device;
  await startConsumer(queueName, device);
});
