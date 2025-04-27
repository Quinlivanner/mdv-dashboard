# Stage 1: Building the code - includes all build dependencies and dev tools
FROM node:20.10.0-alpine AS builder

# Install necessary build dependencies
RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    librsvg-dev

WORKDIR /app

# Copy package files and install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm install --force

# Copy configuration files
COPY .env.local ./
COPY next.config.ts ./

# Copy source code and build the application
COPY . .
RUN npm run build

# Stage 2: Production environment - minimal image with only runtime dependencies
FROM node:20.10.0-alpine

WORKDIR /app

# Copy only the necessary files from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.local ./
COPY --from=builder /app/next.config.ts ./

# Expose the port the app runs on
EXPOSE 30001

# Start the application
CMD ["npm", "start"]