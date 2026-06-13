FROM node:20-alpine

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install all dependencies (including devDependencies required for turbo build)
RUN npm ci

# Build the project (Turbo will build server and all packages. This includes prisma generate via prebuild)
RUN npm run build

# Set production environment
ENV NODE_ENV=production

# Clean up dev dependencies to reduce image size
RUN npm prune --omit=dev

# Start the server (run from the server workspace)
CMD ["npm", "run", "start:prod", "-w", "@glow-fix/api"]
