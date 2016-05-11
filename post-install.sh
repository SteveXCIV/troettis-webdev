#!/usr/bin/env bash

# exit on error
set -o errexit
bower=$(npm bin)'/bower'
gulp=$(npm bin)'/gulp'

echo 'post install script running...'
echo 'running bower...'
$bower install
echo 'running gulp...'
$gulp
echo 'done'
