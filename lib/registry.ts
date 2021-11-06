import * as cdk from '@aws-cdk/core';
import ddb = require('@aws-cdk/aws-dynamodb');
import ec2 = require('@aws-cdk/aws-ec2');
import ecr = require('@aws-cdk/aws-ecr');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');

export class AirConditioningRegistryStackProps {
    public readonly stackProps?: cdk.StackProps;
    
    public readonly vpc: ec2.Vpc;

    public readonly repository: ecr.Repository;

    public readonly usersTable: ddb.Table;
    public readonly actionsTable: ddb.Table;
    public readonly actionsByUserIndex: string;
    public readonly conditionsTable: ddb.Table;
    public readonly conditionsByUserIndex: string;
    public readonly triggersTable: ddb.Table;
}

export class AirConditioningRegistryStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: AirConditioningRegistryStackProps) {
        super(scope, id, props.stackProps);

        const cluster = new ecs.Cluster(this, 'AirConditioningRegistryCluster', {
            clusterName: 'AirConditioningRegistryCluster',
            vpc: props.vpc
        });

        const service = new ecsPatterns.NetworkLoadBalancedFargateService(this, 'AirConditioningRegistryService', {
            cluster: cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromEcrRepository(props.repository),
                environment: {
                    'USERS_TABLE': props.usersTable.tableName,
                    'ACTIONS_TABLE': props.actionsTable.tableName,
                    'CONDITIONS_TABLE': props.conditionsTable.tableName,
                    'TRIGGERS_TABLE': props.triggersTable.tableName,
                    'ACTIONS_BY_USER_INDEX': props.actionsByUserIndex,
                    'CONDITIONS_BY_USER_INDEX': props.conditionsByUserIndex
                }
            }
        });

        props.usersTable.grantReadWriteData(service.taskDefinition.taskRole);
        props.actionsTable.grantReadWriteData(service.taskDefinition.taskRole);
        props.conditionsTable.grantReadWriteData(service.taskDefinition.taskRole);
        props.triggersTable.grantReadWriteData(service.taskDefinition.taskRole);
    }
}