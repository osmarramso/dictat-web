FROM ubuntu:20.04
SHELL ["/bin/bash", "--login", "-c"]
MAINTAINER Osmar De La Fuente
COPY dictat-back /usr/local/service/back
WORKDIR /usr/local/service/log
WORKDIR /usr/local/service/back
EXPOSE 3000
RUN apt-get update -y
RUN apt-get install curl -y

# nvm environment variables
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 21.1.0

RUN apt-get update && apt-get install -y build-essential libssl-dev python python3 gnupg2

RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash

# install node and npm LTS
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && nvm install $NODE_VERSION \
    && nvm use $NODE_VERSION \
    && npm install -g @ionic/cli \
    && npm install -g @angular/cli@14.2.3
    
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
    
WORKDIR /usr/local/service/front
COPY dictat-front /usr/local/service/front
RUN apt-get install supervisor -y
EXPOSE 8100
COPY supervisor.conf /usr/local/service/supervisor.conf
CMD ["supervisord", "-c", "/usr/local/service/supervisor.conf"]
