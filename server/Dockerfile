# Install all dependencies (including devDependencies for building)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Install production dependencies only
FROM node:20-alpine AS deps-production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY src/ src/
COPY tsconfig*.json ./
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy package.json (needed for 'npm run' in CMD)
COPY package.json ./
COPY --from=deps-production /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
