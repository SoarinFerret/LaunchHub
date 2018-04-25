FROM node:carbon-alpine

# Install programs as necessary
RUN apk update > /dev/null && apk add bash > /dev/null && \
    apk add dos2unix --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community/ --allow-untrusted > /dev/null

# Copy Startup file
COPY ./docker_start.sh /start.sh

EXPOSE 8080

CMD [ "/start.sh" ]