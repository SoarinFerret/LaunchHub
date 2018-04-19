FROM node:carbon

# Copy Startup file
COPY ./startup.sh /start.sh

EXPOSE 8080

CMD [ "/start.sh" ]