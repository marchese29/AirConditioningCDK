import * as cdk from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from '@aws-cdk/pipelines';
import { AirConditioningStage } from './app';

export class AirConditioningCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'CodePipeline', {
      pipelineName: 'ACRegistryPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('marchese29/TODO', 'master'),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    pipeline.addStage(new AirConditioningStage(this, 'ACApplication', {
      env: { account: '516158321459', region: 'us-west-2' }
    }));
  }
}
