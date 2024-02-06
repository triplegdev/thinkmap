# Use an official Node runtime as a parent image
FROM node:16-alpine

RUN apk add --no-cache xdg-utils

# Set the working directory
WORKDIR /var/www/react-vite

# Copy the rest of the application code
COPY ./react-vite .

# Install dependencies
RUN npm install

# Expose port 5173 for the React-Vite app
EXPOSE 5173

# Start the application
RUN npm run dev
