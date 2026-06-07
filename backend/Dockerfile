# --- Stage 1: Build TypeScript → JavaScript ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2: Production (lean image) ---
FROM node:22-alpine

WORKDIR /app

# Copy only compiled output and package files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Create uploads directory (will be volume-mounted in production)
RUN mkdir -p uploads

EXPOSE 4000

CMD ["node", "dist/index.js"]
