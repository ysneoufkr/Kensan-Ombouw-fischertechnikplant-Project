import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { initDefaultUser } from './auth.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { opcuaController } from "./opcua-client/controller.js"
import warehouseRoutes from './routes/warehouseRoutes.js';
import conveyerRoutes from './routes/conveyerRoutes.js';
import craneRoutes from './routes/craneRoutes.js';
import ovenRoutes from './routes/ovenRoutes.js';

const UPLOAD_DIR = path.join(__dirname, '../profile_pictures');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const app = express();
const PORT = 3000;


app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use('/profile_pictures', express.static(UPLOAD_DIR));
app.use('/api/auth', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/oven', ovenRoutes)
app.use('/api/crane', craneRoutes)
app.use('/api/conveyer', conveyerRoutes)
app.use('/api/warehouse', warehouseRoutes)


app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});

async function startServer() {
  initDefaultUser();

  app.listen(PORT, () => {
    console.log(`Kensan Auth Server running on http://localhost:${PORT}`);
  });

  opcuaController.connect()
    .then(() => console.log("OPC UA connected"))
    .catch(err => console.error("OPC UA connection failed", err));
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});