FROM node:carbon-alpine

# Install programs as necessary
RUN apk update > /dev/null && apk add -u bash --no-cache > /dev/null && \
    apk add -u dos2unix --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted > /dev/null

# Copy Startup file
COPY ./docker_start.sh /start.sh

# Set working directory, copy code to it
WORKDIR /usr/src/app
COPY ./site-code /usr/src/app

EXPOSE 8080

CMD [ "/start.sh" ]