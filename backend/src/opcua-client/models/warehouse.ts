import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";
import { Destination, WarehouseActions, WarehouseStates } from "../enums/warehouse";
import { WarehouseStatus } from "../enums/status";

export class Warehouse extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Warehouse");
    }

    public async getStatus(): Promise<WarehouseStatus> {
        const baseStatus = await super.getStatus();

        return {
            ...baseStatus,
            State: await this.read("Status.State"),
            Destination: {
                row: await this.read("Status.Destination.row"),
                col: await this.read("Status.Destination.col")
            },
            Action: await this.read("Status.Action"),
            Assignment_destination: {
                row: await this.read("Status.Assignment_destination.row"),
                col: await this.read("Status.Assignment_destination.col")
            },
            Assignment_action: await this.read("Status.Assignment_action"),
            Assignment_in_queue: await this.read("Status.Assignment_in_queue")
        };
    }

    public async readState(): Promise<WarehouseStates> {
        return this.read("Status.State");
    }

    public async getDestination(): Promise<Destination> {
        const row = await this.read("Status.Destination.row");
        const col = await this.read("Status.Destination.col");
        return { row, col };
    }

    public async getAction(): Promise<WarehouseActions> {
        return this.read("Status.Action");
    }

    public async getAssignmentDestination(): Promise<Destination> {
        const row = await this.read("Status.Assignment_destination.row");
        const col = await this.read("Status.Assignment_destination.col");
        return { row, col };
    }

    public async getAssignmentAction(): Promise<WarehouseActions> {
        return this.read("Status.Assignment_action");
    }

    public async getAssignmentInQueue(): Promise<boolean> {
        return this.read("Status.Assignment_in_queue");
    }

    public async writeAssignment([Loc_X, Loc_Y]: number[], action: WarehouseActions) {
        await this.write("Assignments.Destination.row", Loc_X, DataType.Int16);
        await this.write("Assignments.Destination.col", Loc_Y, DataType.Int16);
        await this.write("Assignments.Action", action, DataType.Int16);
    }
}
