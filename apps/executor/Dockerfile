FROM node:18-slim AS builder 

WORKDIR /workspace

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY eslint.config.mjs ./ 

COPY apps/executor ./apps/executor  
COPY lib/nestjs ./lib/nestjs
COPY lib/pulsar ./lib/pulsar

RUN npm install 

RUN npx nx build executor

FROM node:18-slim AS runner 

COPY --from=builder /workspace/package.json ./ 
COPY --from=builder /workspace/apps/executor/package.json ./apps/executor/package.json 
COPY --from=builder /workspace/lib/pulsar/package.json ./lib/pulsar/package.json 
COPY --from=builder /workspace/package-lock.json ./


# set variable to optimize build and exclude dev dependencies 
ENV NODE_ENV=production

RUN npm ci

COPY --from=builder /workspace/dist ./dist 

CMD ["node", "dist/apps/executor/main"]






