# Use the official Node.js image from the Docker Hub
FROM node:22.12.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your application will run on, I set it to 8082 due to my personal computer already using 8080
EXPOSE 8082

# Define the command to run your app
CMD ["node","app.js"]
