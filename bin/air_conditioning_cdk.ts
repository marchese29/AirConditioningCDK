#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AirConditioningCdkStack } from '../lib/pipeline';

const app = new cdk.App();
new AirConditioningCdkStack(app, 'AirConditioningCdkStack', {
  env: {
    account: '516158321459',
    region: 'us-west-2'
  }
});
app.synth();
