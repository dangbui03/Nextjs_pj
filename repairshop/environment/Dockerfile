FROM ubuntu:22.04

ARG NODE_VERSION=20.19.5
ENV NODE_VERSION=${NODE_VERSION}

ADD provision.sh /provision.sh

RUN chmod +x /*.sh

RUN ./provision.sh

WORKDIR /var/www/app
