#!/bin/bash

# arguments
USER=$1
DOWNSTREAM_REPO=$2
BRANCH=$3
TOKEN=$4
MESSAGE=$5

# fetch trigger-travis script and make executable
chmod +x trigger-travis.sh

# trigger build if above conditions hold
if [[ ($TRAVIS_BRANCH == $3) &&
( (! $TRAVIS_JOB_NUMBER == *.*) || ($TRAVIS_JOB_NUMBER == *.1) ) ]] ; then
chmod +x trigger-travis.sh
./trigger-travis.sh $1 $2 $4 $3 $5
fi

# usage function
function usage {
echo "$(basename $0): USER DOWNSTREAM_REPOSITORY BRANCH TOKEN"
}
