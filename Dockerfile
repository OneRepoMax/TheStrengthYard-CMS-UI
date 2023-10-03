# Stage 1: Build the application
FROM node:16 AS builder

# Set the working directory
WORKDIR /app

# Copy only the necessary files to cache node_modules
COPY . .

# Install project dependencies
RUN npm install

# Set environment variable
ARG VITE_S3_ACCESS_KEY
ARG VITE_S3_SECRET_KEY
ARG VITE_S3_BUCKET_NAME
ARG VITE_AWS_REGION
ARG VITE_TSY_API

ENV VITE_S3_ACCESS_KEY=${VITE_S3_ACCESS_KEY}
ENV VITE_S3_SECRET_KEY=${VITE_S3_SECRET_KEY}
ENV VITE_S3_BUCKET_NAME=${VITE_S3_BUCKET_NAME}
ENV VITE_AWS_REGION=${VITE_AWS_REGION}
ENV VITE_TSY_API=${VITE_TSY_API}

# Build the project
RUN npm run build

# Bundle static assets with nginx
FROM nginx:stable-alpine as production
ENV NODE_ENV production
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start the app on port 80
CMD ["nginx", "-g", "daemon off;"]