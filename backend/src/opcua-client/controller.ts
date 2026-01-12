import { ClientSession, OPCUAClient } from "node-opcua";
import { Crane } from "./models/crane";
import { Conveyerbelt } from "./models/conveyerbelt";
import { Oven } from "./models/oven";
import { Warehouse } from "./models/warehouse";

class OPCUAController {
    private client: OPCUAClient;
    private session: ClientSession;

    public warehouse: Warehouse;
    public crane: Crane;
    public oven: Oven;
    public conveyerBelt: Conveyerbelt;

    private ns = 1;
    private endpoint: string = "opc.tcp://opcua:4840/UA/TestServer/GVL/Interface";

    public async connect() {
        this.client = OPCUAClient.create({ endpointMustExist: false });
        await this.client.connect(this.endpoint);
        console.log("Connected to OPC UA server");

        this.session = await this.client.createSession();

        this.crane = new Crane(this.session, this.ns);
        this.conveyerBelt = new Conveyerbelt(this.session, this.ns);
        this.oven = new Oven(this.session, this.ns);
        this.warehouse = new Warehouse(this.session, this.ns);

        await this.warehouse.calibrate();
        await this.crane.calibrate();
        await this.oven.calibrate();
        await this.conveyerBelt.calibrate();

        console.log("Ready to move");
    }

    public async disconnect() {
        await this.session.close();
        await this.client.disconnect();
        console.log("Session closed");
    }
}

export const opcuaController = new OPCUAController();