#!/usr/bin/env node

import * as cdk from '@aws-cdk/core';
import { TypescriptCdkStack } from './stack/typescript-cdk-stack';

const app = new cdk.App();
const STACK_NAME = 'TYPESCRIPT-Cdk-STACK';
new TypescriptCdkStack(app, STACK_NAME);
