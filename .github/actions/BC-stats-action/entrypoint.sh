#!/bin/bash
set -eu # stop on error

export HOME=/root

node /BC-stats/src/index.js
