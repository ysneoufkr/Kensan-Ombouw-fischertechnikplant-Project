import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";
import { CraneDestinations, CraneStates } from "../enums/crane";
import { CraneStatus } from "../enums/status";

export class Crane extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Crane");
    }

    public async getStatus(): Promise<CraneStatus> {
        const baseStatus = await super.getStatus();

        return {
            ...baseStatus,
            State: await this.read("Status.State"),
            source: await this.read("Status.source"),
            destination: await this.read("Status.destination"),
            Assignment_source: await this.read("Status.Assignment_source"),
            Assignment_destination: await this.read("Status.Assignment_destination")
        };
    }

    public async readState(): Promise<CraneStates> {
        return this.read("Status.State");
    }

    public async getSource(): Promise<CraneDestinations> {
        return this.read("Status.source");
    }

    public async getDestination(): Promise<CraneDestinations> {
        return this.read("Status.destination");
    }

    public async getAssignmentSource(): Promise<CraneDestinations> {
        return this.read("Status.Assignment_source");
    }

    public async getAssignmentDestination(): Promise<CraneDestinations> {
        return this.read("Status.Assignment_destination");
    }

    public async writeAssignment(source: CraneDestinations, destination: CraneDestinations) {
        await this.write("Assignments.source", source, DataType.Int16);
        await this.write("Assignments.destination", destination, DataType.Int16);
    }
}
