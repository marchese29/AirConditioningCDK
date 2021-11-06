import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');

export class AirConditioningNetworkStack extends cdk.Stack {
    public readonly vpc: ec2.Vpc;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.vpc = new ec2.Vpc(this, 'VPC', {
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: 'Application',
                    subnetType: ec2.SubnetType.PUBLIC
                }
            ]
        });
    }
}