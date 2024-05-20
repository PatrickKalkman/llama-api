#!/bin/bash
VERSION="0.2.1"
APP="llama.cpp"
docker buildx build --platform linux/amd64,linux/arm64 -f ./Dockerfile -t pkalkman/$APP:$VERSION  --push .