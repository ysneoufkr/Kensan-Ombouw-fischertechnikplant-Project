import { ClientSession, AttributeIds, DataType } from "node-opcua";
import { BaseStatus } from "../enums/status";
import { Error } from "../enums/error";

export class BaseModel {
    protected session: ClientSession;
    protected ns: number;
    protected name: string;

    constructor(session: ClientSession, namespaceIndex: number, objectName: string) {
        this.session = session;
        this.ns = namespaceIndex;
        this.name = objectName;
    }

    protected nodeId(variable: string): string {
        return `ns=${this.ns};s=${this.name}.${variable}`;
    }

    protected async read(variable: string): Promise<any> {
        const nodeId = this.nodeId(variable);
        const dataValue = await this.session.read({ nodeId, attributeId: AttributeIds.Value });
        return dataValue.value.value;
    }

    protected async write(variable: string, value: any, dataType: DataType): Promise<void> {
        const nodeId = this.nodeId(variable);
        await this.session.write({
            nodeId,
            attributeId: AttributeIds.Value,
            value: { value: { dataType, value } }
        });
    }


    // status

    async getStatus(): Promise<BaseStatus> {
        return {
            Ready: await this.getReady(),
            Error: await this.getError(),
            Error_str: await this.getErrorString()
        }
    }

    getReady() {
        return this.read("Status.Ready");
    }

    getError(): Promise<Error> {
        return this.read("Status.Error");
    }

    getErrorString() {
        return this.read("Status.Error_str");
    }


    //controls


    async start() {
        await this.write("Control.Start", true, DataType.Boolean);
    }

    async stop() {
        await this.write("Control.Stop", true, DataType.Boolean);
    }

    async forceStop() {
        await this.write("Control.Force_stop", true, DataType.Boolean);
    }

    async resetError() {
        await this.write("Control.Reset_error", true, DataType.Boolean);
    }

    async calibrate() {
        await this.write("Control.Calibrate", true, DataType.Boolean);
    }

    async waitForFinish() {
        while (!await this.getReady()) {
            await new Promise(res => setTimeout(res, 200));
        }
    }
}
