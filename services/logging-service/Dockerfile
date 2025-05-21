# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY bun.lock package.json ./
COPY src ./
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3234

# Run the app
CMD ["bun", "run", "start"]