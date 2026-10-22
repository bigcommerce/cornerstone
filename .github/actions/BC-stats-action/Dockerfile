FROM node:10-buster

LABEL com.github.actions.name="BigCommerce PR Stats"
LABEL com.github.actions.description="Compares stats of a PR with the main branch"
LABEL repository="https://github.com/bigcommerce/cornerstone"

COPY . /BC-stats

# Install node_modules
RUN cd /BC-stats && npm install --production

RUN git config --global user.email 'stats@localhost'
RUN git config --global user.name 'BC stats'

RUN apt update
RUN apt install apache2-utils -y

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
