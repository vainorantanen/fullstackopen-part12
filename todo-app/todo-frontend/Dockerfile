# Stage 1: Test the component Todo
FROM node:16 AS test

WORKDIR /usr/src/app

COPY . .

# Install dependencies for testing
RUN npm ci

# Run the tests (Assuming you have the test script defined in package.json)
RUN CI=true npm test

# Stage 2: Build the application
FROM node:16 AS build

WORKDIR /usr/src/app

COPY . .

# Set the environment variable for the backend URL
ENV REACT_APP_BACKEND_URL=http://localhost:3000

# Install dependencies for production build
RUN npm ci

# Build the React app
RUN npm run build

# Stage 3: Final Image
FROM node:16

WORKDIR /usr/src/app

# Copy only the built files from the previous stage (build)
COPY --from=build /usr/src/app/build ./build

# Install serve to run the production build
RUN npm install -g serve
CMD ["serve", "build"]