# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other project files
COPY . .

# Expose port 4000 (your app runs here)
EXPOSE 4000

# Start the Node app
CMD ["npm", "start"]
