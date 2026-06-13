# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build & prisma)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma Client (this will use your matching local version)
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# --- Stage 2: Production ---
FROM node:20-alpine AS production

WORKDIR /app

# Set Node to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy generated Prisma Client from the builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy built NestJS output
COPY --from=builder /app/dist ./dist

# Start the application
CMD ["npm", "run", "start:prod"]
