# Builder Stage
FROM node:18-slim AS builder

WORKDIR /workspace

# Copy necessary files for building the app
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./
COPY webpack.*.config.js ./

COPY apps/products ./apps/products
COPY lib/grpc ./lib/grpc
COPY lib/nestjs ./lib/nestjs

# Install dependencies
RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

# Build the app
RUN npx nx build products

# Runner Stage
FROM node:18-slim AS runner

WORKDIR /app

# Copy necessary files
COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/apps/products/package.json ./apps/products/package.json
COPY --from=builder /workspace/lib/grpc/package.json ./lib/grpc/package.json
COPY --from=builder /workspace/apps/products/drizzle.config.ts ./apps/products/drizzle.config.ts
COPY --from=builder /workspace/apps/products/drizzle ./apps/products/drizzle

# Set production environment
ENV NODE_ENV=production

# Install production dependencies
RUN npm ci

# Copy build output and other files
COPY --from=builder /workspace/dist ./dist

# Run the application
CMD ["node", "dist/apps/products/main"]





