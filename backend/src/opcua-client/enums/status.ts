import { Colors, ConveyerStates } from "./conveyerbelt";
import { CraneDestinations, CraneStates } from "./crane";
import { Error } from "./error";
import { OvenStates } from "./oven";
import { WarehouseActions, WarehouseStates } from "./warehouse";

export interface BaseStatus {
    Ready: boolean;
    Error: Error;
    Error_str: string;
}

export interface CraneStatus extends BaseStatus {
    State: CraneStates;
    source: CraneDestinations;
    destination: CraneDestinations;
    Assignment_source: CraneDestinations;
    Assignment_destination: CraneDestinations;
}

export interface WarehouseStatus extends BaseStatus {
    State: WarehouseStates;
    Destination: {
        row: number;
        col: number;
    };
    Action: WarehouseActions;
    Assignment_destination: {
        row: number;
        col: number;
    };
    Assignment_action: WarehouseActions;
    Assignment_in_queue: boolean;
}

export interface OvenStatus extends BaseStatus {
    State: OvenStates;
    Queue_length: number;
    Assignment_in_queue: boolean;
}

export interface ConveyerStatus extends BaseStatus {
    State: ConveyerStates;
    Color: Colors;
    Queue_length: number;
    Assignment_in_queue: boolean;
}