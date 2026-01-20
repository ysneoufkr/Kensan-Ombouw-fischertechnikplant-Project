import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";
import { OvenStates } from "../enums/oven";
import { OvenStatus } from "../enums/status";

export class Oven extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Oven");
    }

    public async getStatus(): Promise<OvenStatus> {
        const baseStatus = await super.getStatus();

        return {
            ...baseStatus,
            State: await this.read("Status.State"),
            Queue_length: await this.read("Status.Queue_length"),
            Assignment_in_queue: await this.read("Status.Assignment_in_queue")
        };
    }

    public async readState(): Promise<OvenStates> {
        return this.read("Status.State");
    }

    public async getAssignmentInQueue(): Promise<boolean> {
        return this.read("Status.Assignment_in_queue");
    }

    public async getQueueLength(): Promise<number> {
        return this.read("Status.Queue_length");
    }

    public async addQueue() {
        await this.write("Assignments.Add_Queue", true, DataType.Boolean);
    }
}
