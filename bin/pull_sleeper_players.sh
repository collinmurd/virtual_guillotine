#!/bin/bash

curl "https://api.sleeper.app/v1/players/nfl" -o /home/guillotine/data/sleeperPlayerMap.json
docker restart guillotine-app-1