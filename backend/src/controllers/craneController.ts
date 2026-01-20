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

export const craneAssignment = (async (req: Request, res: Response) => {
    try {
        const data = req.body;
        await opcuaController.crane.writeAssignment(data.source, data.destination);
        res.status(200).json({ message: 'Assignment set successfully' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});