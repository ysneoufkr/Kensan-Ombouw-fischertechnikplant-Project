// src/backend/api.ts
import express from "express";
import cors from "cors";
import { connectToOpcServer, readAllNodes, readNodeValue, writeNodeValue, nodeMap } from "./opcClient";
<<<<<<< HEAD
import { opcuaController } from "./opcua-client/controller"
import 'dotenv/config';
=======
>>>>>>> main

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

// Connect OPC UA
connectToOpcServer().catch(console.error);

// Endpoint: alle nodes uitlezen
app.get("/api/all", async (req, res) => {
  try {
    const data = await readAllNodes();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
await opcuaController.connect()

app.get("/api/conveyerbelt/status", async (req, res) => {
  try {
    const value = await opcuaController.conveyerBelt.getStatus();
    res.json({ value });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/oven/status", async (req, res) => {
  try {
    const value = await opcuaController.oven.getStatus();
    res.json({ value });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/crane/status", async (req, res) => {
  try {
    const value = await opcuaController.crane.getStatus();
    res.json({ value });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/warehouse/status", async (req, res) => {
  try {
    const value = await opcuaController.warehouse.getStatus();
    res.json({ value });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 API draait op http://localhost:${PORT}`);
});

