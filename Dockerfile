# Use node image as base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the application's dependencies

RUN npm install --legacy-peer-deps


# Copy the application source code to the container
COPY . .

# Build the Angular application
RUN npm run build

# Serve the built application using an Nginx server
FROM nginx:1.19

    COPY --from=0 /app/dist/atlantis-ng /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]