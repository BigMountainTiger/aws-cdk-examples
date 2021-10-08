#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { VoiceNumberRecognitionStack } = require('./stacks/voice-number-recognition-stack');
const { VoiceNumberRecognitionDockerStack } = require('./stacks/voice-number-recognition-docker-stack');

const app = new cdk.App();
new VoiceNumberRecognitionStack(app, 'Voice-Number-STACK', {});
new VoiceNumberRecognitionDockerStack(app, 'Voice-Number-DOCKER-STACK', {});