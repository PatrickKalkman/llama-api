#!/bin/bash
VERSION="0.2.1-cuda"
APP="llama.cpp"
docker buildx build --platform linux/amd64 -f ./Dockerfile.cuda -t pkalkman/$APP:$VERSION  --push .