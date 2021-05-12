# syntax = docker/dockerfile:1.0-experimental
FROM    node:12.22.1-alpine3.12
ENV     NODE_ENV=development
EXPOSE  3500

RUN     mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
# Set workdir to newly made directory with correct permissions
WORKDIR /home/node/app

COPY    package*.json ./

USER    root
# Install required packages through apk
RUN     set -x \
        && apk add --no-cache bash git openssh python2

# Update package list, then install dependencies and stencil-cli
RUN     npm config set user root -g \
        && npm install \
        && npm install -g @bigcommerce/stencil-cli

# Switch to node user and set in npm
USER    node
RUN     npm config set user node -g

COPY    --chown=node:node . .

# serve a live, Browsersync enabled preview of the theme
CMD     [ "stencil", "start" ]
