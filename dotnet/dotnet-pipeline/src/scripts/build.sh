#!/bin/bash

cd src/lambdas
for d in ./*/; do cd "$d" && dotnet publish; done