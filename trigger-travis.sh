#!/bin/bash
## brief: trigger a downstream travis build

# variables
USER=$1
REPO=$2
TOKEN=$3
BRANCH=$4
MESSAGE=$5

# check arguments and add message
if [ $# -eq 5 ] ; then
MESSAGE=",\"message\": \"$5\""
elif [ -n "$TRAVIS_REPO_SLUG" ] ; then
MESSAGE=",\"message\": \"Triggered from upstream build of $TRAVIS_REPO_SLUG by commit "`git rev-parse --short HEAD`"\""
fi

# for debugging
echo "USER=$USER"
echo "REPO=$REPO"
echo "TOKEN=$TOKEN"
echo "BRANCH=$BRANCH"
echo "MESSAGE=$MESSAGE"

# curl POST request content body
BODY="{
\"request\": {
\"branch\":\"$BRANCH\"
$MESSAGE
}}"

# make a POST request with curl
curl -s -X POST \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-H "Travis-API-Version: 3" \
-H "Authorization: token $TOKEN" \
-d "$body" \
https://api.travis-ci.org/repo/${USER}%2F${REPO}/requests \
| tee /tmp/travis-request-output.$$.txt

if grep -q '"@type": "error"' /tmp/travis-request-output.$$.txt; then
cat /tmp/travis-request-output.$$.txt
exit 1
elif grep -q 'access denied' /tmp/travis-request-output.$$.txt; then
cat /tmp/travis-request-output.$$.txt
exit 1
fi

sleep 1m

#The 1m sleep is to allow Travis to trigger the dependent build:
echo "Waiting for the dependent build to start..."
