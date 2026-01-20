import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createCraneObject(namespace: Namespace) {

    const crane = namespace.addObject({
        browseName: "Crane",
        organizedBy: namespace.addressSpace.rootFolder.objects
    });

    // status variables

    let ready = true;
    let error = 0;
    let errorStr = "No Error";
    let craneState = 0;
    let craneSource = 0;
    let craneDestination = 0;
    let assignmentSource = 0;
    let assignmentDestination = 0;

    const craneStatus = namespace.addObject({
        browseName: "Status",
        componentOf: crane
    });

    namespace.addVariable({
        componentOf: craneStatus,
        browseName: "Ready",
        nodeId: "ns=1;s=Crane.Status.Ready",
        dataType: "Boolean",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: ready })
        }
    });

    namespace.addVariable({
        componentOf: craneStatus,
        browseName: "Error",
        nodeId: "ns=1;s=Crane.Status.Error",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: error })
        }
    });

    namespace.addVariable({
        componentOf: craneStatus,
        browseName: "Error_str",
        nodeId: "ns=1;s=Crane.Status.Error_str",
        dataType: "String",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.String, value: errorStr })
        }
    });

    namespace.addVariable({
        componentOf: craneStatus,
        browseName: "State",
        nodeId: "ns=1;s=Crane.Status.State",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: craneState })
        }
    });

    namespace.addVariable({
        componentOf: craneStatus,
        browseName: "source",
        nodeId: "ns=1;s=Crane.Status.source",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: craneSource })
        }
    });

    namespace.addVariable({
        componentOf: craneStatus,
        browseName: "destination",
        nodeId: "ns=1;s=Crane.Status.destination",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: craneDestination })
        }
    });

    namespace.addVariable({
        componentOf: craneStatus,
        browseName: "Assignment_source",
        nodeId: "ns=1;s=Crane.Status.Assignment_source",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: assignmentSource })
        }
    });

    namespace.addVariable({
        componentOf: craneStatus,
        browseName: "Assignment_destination",
        nodeId: "ns=1;s=Crane.Status.Assignment_destination",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: assignmentDestination })
        }
    });

    const statusAssignment = namespace.addObject({
        browseName: "Assignment",
        componentOf: crane
    });

    namespace.addVariable({
        componentOf: statusAssignment,
        browseName: "Assignment_source",
        nodeId: "ns=1;s=Crane.Assignment.source",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: assignmentSource }),
            set: (variant: Variant) => {
                assignmentSource = variant.value;
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: statusAssignment,
        browseName: "Assignment_destination",
        nodeId: "ns=1;s=Crane.Assignment.destination",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: assignmentDestination }),
            set: (variant: Variant) => {
                assignmentDestination = variant.value;
                return StatusCodes.Good;
            }
        }
    });

    return crane;
}