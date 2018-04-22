FROM node:carbon

# Install programs as necessary
RUN apt-get update && apt-get install dos2unix -y

# Copy app source
COPY ./site-code /usr/src/app

# Copy Startup file
COPY ./startup.sh /start.sh

EXPOSE 8080

CMD [ "/start.sh" ]