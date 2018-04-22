FROM node:carbon

# Install programs as necessary
RUN apt-get update && apt-get install dos2unix -y

# Copy Startup file
COPY ./docker_start.sh /start.sh

EXPOSE 8080

CMD [ "/start.sh" ]