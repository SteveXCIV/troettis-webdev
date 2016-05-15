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

echo -n 'deployment build complete,'

if [ -z $OPENSHIFT_REPO_DIR ]; then
    echo ' skipping cleanup.'
else
    echo ' starting cleanup...'
    echo 'removing bower_components...'
    rm -r ./bower_components
    echo 'uninstalling bower...'
    npm uninstall bower
    echo 'removing bower.json...'
    rm ./bower.json
    echo 'uninstalling gulp...'
    npm uninstall gulp
    echo 'removing gulpfile.js'
    rm ./gulpfile.js
    echo 'removing sass source...'
    rm -r ./css
    echo 'removing deployment script...'
    rm ./deploy
    echo 'cleanup complete'
fi

echo 'done'
