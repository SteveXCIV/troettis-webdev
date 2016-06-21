#!/usr/bin/env bash

# quick check to ensure mongod is running
# all current and no header | grep for mongod > /dev/null
ps -o comm='' | grep 'mongod' > /dev/null
if [ $? -eq 0 ]; then
    echo 'mongod already running'
else
    echo 'starting mongod detatched...'
    nohup mongod &> /dev/null &
    echo 'mongod started'
    kill_mongod=1
fi

# exit on error
set -o errexit

echo 'Running tests and then code coverage...'
istanbul cover _mocha -- -R spec

if [ kill_mongod ]; then
    echo 'killing mongod...'
    pkill -9 mongod > /dev/null && echo 'mongod killed'
fi

echo 'Open code coverage results...'
open ./coverage/lcov-report/index.html

echo 'done'
