#!/usr/bin/env bash

# exit on error
set -o errexit
bower=$(npm bin)'/bower'
gulp=$(npm bin)'/gulp'

if [ -z $OPENSHIFT_REPO_DIR ]; then
    echo 'not on openshift - using default node directory'
else
    echo 'on openshift - using app-root/runtime directory'
    HOME=$HOME/app-root/runtime
fi

echo 'post install script running...'
echo 'running bower...'
$bower install
echo 'running gulp...'
$gulp
echo 'done'
