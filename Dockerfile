# Start from node-alpine
FROM node:18-alpine

# Create working directory
RUN mkdir -p /app & mkdir -p /app/bin
WORKDIR /app

# Copy dependencies list and source code into container
COPY ./package.json /app
COPY ./src/ /app/bin

# Install dependencies
RUN npm install

# Start the webserver
CMD [ "node", "bin/index.js" ]