import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";
import { Colors, ConveyerStates } from "../enums/conveyerbelt";
import { ConveyerStatus } from "../enums/status";

export class Conveyerbelt extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Conveyerbelt");
    }

    public async getStatus(): Promise<ConveyerStatus> {
        const baseStatus = await super.getStatus();

        return {
            ...baseStatus,
            State: await this.read("Status.State"),
            Color: await this.read("Status.Color"),
            Queue_length: await this.read("Status.Queue_length"),
            Assignment_in_queue: await this.read("Status.Assignment_in_queue")
        };
    }

    public async readColor(): Promise<Colors> {
        return this.read("Status.Color");
    }

    public async readState(): Promise<ConveyerStates> {
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
