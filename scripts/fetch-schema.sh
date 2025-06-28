#!/bin/sh

# temporary file
TEMP_FILE="./openapi.json"

# convert to latest swagger version
curl "https://converter.swagger.io/api/convert?url=https://blockchain-gateway-stillness.live.tech.evefrontier.com/docs/doc.json" -H "Accept: application/json" -o $TEMP_FILE

# generate schema
npx openapi-typescript $TEMP_FILE -o ./types/world-api.schema.d.ts

# remove temporary file
rm $TEMP_FILE
