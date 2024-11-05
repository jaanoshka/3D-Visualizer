# Use a Node.js image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install  # or npm ci if you want a clean install

# Install Vite globally (optional)
RUN npm install -g vite

# Copy the entire app after installing dependencies
COPY . .

# Expose the port Vite uses (default 5173)
EXPOSE 5173

# Start Vite
CMD ["npm", "run", "dev"]