#!/bin/sh

BRANCH=$1

case $BRANCH in
  'master') echo 'latest' ;;
  *) echo 'none' ;;
esac