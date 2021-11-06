import * as cdk from '@aws-cdk/core';
import ddb = require('@aws-cdk/aws-dynamodb');
import sqs = require('@aws-cdk/aws-sqs');
import { Duration } from '@aws-cdk/core';

export class AirConditioningInfrastructureStack extends cdk.Stack {
    public readonly usersTable: ddb.Table;
    public readonly actionsTable: ddb.Table;
    public readonly actionsByUserIndex: string = 'actions_by_user_key-v01';
    public readonly conditionsTable: ddb.Table;
    public readonly conditionsByUserIndex: string = 'conditions_by_user_key-v01';
    public readonly triggersTable: ddb.Table;
    public readonly actionQueue: sqs.Queue;

    constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
        super(scope, id, props);

        this.usersTable = new ddb.Table(this, 'UsersTable', {
            tableName: `${props.env?.region}-users-v01`,
            writeCapacity: 1,
            readCapacity: 1,
            partitionKey: {
                name: 'user_key',
                type: ddb.AttributeType.STRING
            }
        });

        this.actionsTable = new ddb.Table(this, 'ActionsTable', {
            tableName: `${props.env?.region}-actions-v01`,
            writeCapacity: 1,
            readCapacity: 1,
            partitionKey: {
                name: 'action_id',
                type: ddb.AttributeType.STRING
            }
        });
        this.actionsTable.addGlobalSecondaryIndex({
            indexName: `${this.actionsByUserIndex}`,
            writeCapacity: 1,
            readCapacity: 1,
            partitionKey: {
                name: 'user_key',
                type: ddb.AttributeType.STRING
            }
        });

        this.conditionsTable = new ddb.Table(this, 'ConditionsTable', {
            tableName: `${props.env?.region}-conditions-v01`,
            writeCapacity: 1,
            readCapacity: 1,
            partitionKey: {
                name: 'condition_id',
                type: ddb.AttributeType.STRING
            },
            stream: ddb.StreamViewType.NEW_AND_OLD_IMAGES
        });
        this.conditionsTable.addGlobalSecondaryIndex({
            indexName: `${this.conditionsByUserIndex}`,
            writeCapacity: 1,
            readCapacity: 1,
            partitionKey: {
                name: 'user_key',
                type: ddb.AttributeType.STRING
            }
        });

        this.triggersTable = new ddb.Table(this, 'TriggersTable', {
            tableName: `${props.env?.region}-triggers-v01`,
            writeCapacity: 1,
            readCapacity: 1,
            partitionKey: {
                name: 'trigger_id',
                type: ddb.AttributeType.STRING
            }
        });

        const actionDlq = new sqs.Queue(this, 'ActionDLQ', {
            queueName: `${props.env?.region}-triggered-actions-queue-dlq`,
            retentionPeriod: Duration.days(1)
        });
        this.actionQueue = new sqs.Queue(this, 'ActionQueue', {
            queueName: `${props.env?.region}-triggered-actions-queue`,
            retentionPeriod: Duration.days(1),
            deadLetterQueue: {
                queue: actionDlq,
                maxReceiveCount: 5
            }
        });
    }
}