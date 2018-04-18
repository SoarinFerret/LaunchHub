FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies and
# Copy app source
COPY ./site-code /usr/src/app

# Switch out the commented lines for prod deployment
RUN npm install
#RUN npm install --only-production

EXPOSE 8080
cmd [ "npm", "start" ]