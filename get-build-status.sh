#!/bin/bash

#arguments
USER=$1
DOWNSTREAM_REPO=$2
TOKEN=$3

i=1
max=300
while [ $i -lt $max ]
do

echo "--------------------------------------------"
echo "Polling for the tests run build status..."

# login to travis and get build status
STATUS=$(travis status --skip-completion-check --org -t $TOKEN -px -r $USER/$DOWNSTREAM_REPO)

if [ "$STATUS" == "passed" ]
then
echo "TESTS RUN... $STATUS :-) "
break #As soon as the Repo2 run pass, we break and return back to the Repo1 build run
elif [ "$STATUS" == "failed" ]
then
echo "TESTS RUN... $STATUS :-("
echo "Stop building elements"
exit 1 #As soon as the Repo2 run fail, we stop building Repo1
fi

true $(( i++ ))
sleep 1 #This 1s is required to poll the build status for every second
done
