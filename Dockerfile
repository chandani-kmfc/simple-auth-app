# Use Node 20 instead of 18
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install required build dependencies for native modules
RUN apk add --no-cache python3 make g++ \
    && npm install \
    && apk del python3 make g++

# Copy all other project files
COPY . .

# Expose app port
EXPOSE 4000

# Run app
CMD ["node", "server/server.js"]
