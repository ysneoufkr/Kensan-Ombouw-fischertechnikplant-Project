import { opcuaController } from "../opcua-client/controller";
import { Request, Response } from 'express';


export const warehouseStatus = (async (req: Request, res: Response) => {
    try {
        const value = await opcuaController.warehouse.getStatus();
        res.json({ value });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});