## Intermediate build with multiple layers
FROM node:18-alpine

# Create working directory
RUN mkdir -p /app/bin && mkdir -p /app/public && mkdir -p /app/views
WORKDIR /app

# Copy dependencies list ...
COPY ./package.json ./package-lock.json /app/
# .. the source code
COPY ./src/ /app/bin
# .. and static webserver files plus the views to the container
COPY ./views/ /app/views
COPY ./public/ /app/public

# Install dependencies
RUN npm install --production

# Define the port the webserver should listen to
ENV PORT 3000
# and expose this port, too
EXPOSE 3000

# Start the webserver
CMD [ "node", "bin/index.js" ]