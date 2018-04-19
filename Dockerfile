FROM node:carbon

# Copy app source
COPY ./site-code /usr/src/app

# Copy Startup file
COPY ./startup.sh /start.sh

EXPOSE 8080

CMD [ "/start.sh" ]