#!/usr/bin/env bash
# Creates an .env from ENV variables for use with react-native-config
# ENV_WHITELIST=${ENV_WHITELIST:-"^GOOGLE"}
# ENV_WHITELIST=${ENV_WHITELIST:-"^MAPBOX"}
# printf "Creating an .env file with the following whitelist:\n"
# printf "%s\n\n" $ENV_WHITELIST
# set | egrep -e $ENV_WHITELIST | egrep -v "^_" | egrep -v "WHITELIST" > .env
# printf "\n.env created with contents:\n"
echo GOOGLE_PLACES_API_KEY=$GOOGLE_PLACES_API_KEY >> .env
echo MAPBOX_ACCESS_TOKEN=$MAPBOX_ACCESS_TOKEN >> .env
