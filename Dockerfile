FROM node:carbon

# Install programs as necessary
RUN apt-get update > /dev/null 2>&1 && apt-get install dos2unix -y > /dev/null 2>&1

# Copy Startup file
COPY ./docker_start.sh /start.sh

EXPOSE 8080

CMD [ "/start.sh" ]