FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared-contracts ./packages/shared-contracts
COPY apps/api ./apps/api

RUN npm install
RUN npm run build --workspace=apps/api

FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 4000
CMD ["npm", "run", "start", "--workspace=apps/api"]
