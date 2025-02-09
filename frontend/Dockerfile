# Start with the base image 
FROM node:20

# Change the working dir to frontend
WORKDIR /frontend

# Copy the package json to image
COPY package*.json ./

# Install the libs
RUN npm install

# Add code inside the src to image 
COPY . .
# Expose the port on which the image will run
EXPOSE 5173

# Run the default commange
CMD ["npm","run", "dev"]