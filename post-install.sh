#!/usr/bin/env bash

# exit on error
set -o errexit
bower=$(npm bin)'/bower'
gulp=$(npm bin)'/gulp'

if [ -z $OPENSHIFT_REPO_DIR ]; then
    echo 'not on openshift'
else
    echo 'on openshift'
    HOME=$HOME/app-root/runtime
fi

echo 'post install script running...'
echo 'running bower...'
$bower install
echo 'running gulp...'
$gulp
echo 'done'
