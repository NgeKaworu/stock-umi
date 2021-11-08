#!/bin/bash
set -e

docker build -f ./Dockerfile -t ngekaworu/stock-umi ..;
docker push ngekaworu/stock-umi;