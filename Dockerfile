# Stage 1: Build the application
FROM node:16 AS builder

# Set the working directory
WORKDIR /app

# Copy only the necessary files to cache node_modules
COPY . .

# Install project dependencies
RUN npm install

# Build the project
RUN npm run build

# Stage 2: Create a smaller production image
FROM nginx:alpine

# Copy the built app from the builder stage to the nginx web server
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 8080
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
