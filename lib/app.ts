import * as cdk from '@aws-cdk/core';
import { AirConditioningInfrastructureStack } from './infra';
import { AirConditioningNetworkStack } from './networking';
import { AirConditioningRegistryStack } from './registry';

export class AirConditioningStage extends cdk.Stage {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        // const networkStack = new AirConditioningNetworkStack(this, 'ACNetwork', { env: props?.env });
        const infraStack = new AirConditioningInfrastructureStack(this, 'ACInfrastructure', { env: props?.env });
        // const registryStack = new AirConditioningRegistryStack(this, 'ACRegistry', {
        //     stackProps: { env: props?.env },
        //     vpc: networkStack.vpc,
        //     usersTable: infraStack.usersTable,
        //     actionsTable: infraStack.actionsTable,
        //     actionsByUserIndex: infraStack.actionsByUserIndex,
        //     conditionsTable: infraStack.conditionsTable,
        //     conditionsByUserIndex: infraStack.conditionsByUserIndex,
        //     triggersTable: infraStack.triggersTable
        // });
    }
}