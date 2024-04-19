#!/bin/bash

cd ./public/data/
cp ../../cypress/fixtures/legacy.json ./platform-backend/v0/providers/transformations/legacy.json
# sudo kill -9 $(lsof -t -i:8080)
python -m http.server 8080 &
cd ../../
