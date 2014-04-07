#!/bin/bash

# example for authenticating to api
user=cybojenix
pass=

function jwt_auth() {
    # input:
    #   jwt_user - username
    #   jwt_pass - password
    #   jwt_url  - location to auth to
    # returns:
    #   jwt_token - the jwt auth token
    # return codes:
    #   0 - all succeeded
    #   1 - invalid errors
    #   2 - can't make connection
    #   3 - credentials are invalid

    [[ $3 ]] || return 1
    jwt_user="$1"
    jwt_pass="$2"
    jwt_url="$3"

    # post the user and pass using curl
    jwt_token_json=$(curl -s -X POST -d "username=${jwt_user}&password=$jwt_pass" "$jwt_url") || return 2

    # return data always in the form '{"token": "<token data>"}' if valid
    valid='{"token":*'
    [[ $jwt_token_json == $valid ]] || return 3

    # strip all the json fluff
    jwt_token_json=${jwt_token_json#*: \"}
    jwt_token=${jwt_token_json%\"\}}
    printf %s "$jwt_token"
    [[ $jwt_token ]] || return 3
}

server="http://localhost:8000/jwt/"
[[ ${user} ]] || read -p "Enter Username: " user
[[ ${pass} ]] || read -s -p "Enter Password: " pass
printf "\n"

jwt_token=$(jwt_auth "$user" "$pass" "$server") || printf "error code: %d\n" "$?"
printf "JWT Token: %s\n" "$jwt_token"

