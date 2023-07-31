# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Nodemon globally
RUN npm install -g nodemon

# Copy the rest of the code into the container's working directory
COPY . .

# Set the environment variable for development
ENV DEBUG=todo-backend:*

# Use Nodemon to start the server
CMD ["npm", "run", "dev"]

# ["nodemon", "index.js"]
