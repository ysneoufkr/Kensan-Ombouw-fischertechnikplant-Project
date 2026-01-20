import { opcuaController } from "../opcua-client/controller";
import { Request, Response } from 'express';


export const craneStatus = (async (req: Request, res: Response) => {
    try {
        const value = await opcuaController.crane.getStatus();
        res.json({ value });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});