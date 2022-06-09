#!/usr/bin/env python3
import os

import aws_cdk as cdk

from stacks.api_gw_alias_stack import ApiGwAliasStack


app = cdk.App()
ApiGwAliasStack(app, "ApiGwAliasStack")

app.synth()
